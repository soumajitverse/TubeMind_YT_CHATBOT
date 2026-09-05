import json
import re
import urllib.request
from typing import Dict, Any, List
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound, VideoUnavailable

def extract_video_id(url_or_id: str) -> str:
    """
    Extracts 11-character YouTube video ID from any YouTube URL format or raw ID.
    Supports:
    - https://www.youtube.com/watch?v=Gfr50f6ZBvo
    - https://www.youtube.com/watch?v=Gfr50f6ZBvo&feature=share
    - https://youtu.be/Gfr50f6ZBvo
    - https://youtu.be/Gfr50f6ZBvo?t=30
    - https://www.youtube.com/embed/Gfr50f6ZBvo
    - https://www.youtube.com/shorts/Gfr50f6ZBvo
    - Raw 11-character ID: Gfr50f6ZBvo
    """
    if not url_or_id:
        raise ValueError("YouTube video URL or ID cannot be empty.")
    
    url_or_id = url_or_id.strip()
    
    # Comprehensive YouTube URL Regex pattern
    patterns = [
        r'(?:v=|\/vi\/|v\/|vi\/|e\/|embed\/|shorts\/|youtu\.be\/|\/v\/)([^"&?\/\s]{11})',
        r'(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})'
    ]
    
    for pattern in patterns:
        match = re.search(pattern, url_or_id)
        if match:
            return match.group(1)
    
    # Fallback: Check if string is already a valid 11-char YouTube ID
    if len(url_or_id) == 11 and re.match(r'^[a-zA-Z0-9_-]{11}$', url_or_id):
        return url_or_id
        
    raise ValueError(f"Could not extract a valid 11-character YouTube video ID from URL: '{url_or_id}'")


def _fetch_transcript_ytdlp(video_id: str) -> Dict[str, Any]:
    """
    Fallback transcript fetcher using yt-dlp to bypass YouTube cloud provider IP blocks.
    Uses Android & Web innertube extractor args.
    """
    try:
        import yt_dlp
    except ImportError:
        raise ValueError("yt-dlp package is not installed on server.")

    url = f"https://www.youtube.com/watch?v={video_id}"
    ydl_opts = {
        'skip_download': True,
        'writesubtitles': True,
        'writeautomaticsub': True,
        'subtitleslangs': ['en.*', '.*'],
        'quiet': True,
        'no_warnings': True,
        'extractor_args': {
            'youtube': {
                'player_client': ['android', 'web']
            }
        }
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        try:
            info = ydl.extract_info(url, download=False)
        except Exception as e:
            raise ValueError(f"yt-dlp info extraction failed: {str(e)}")

    subtitles = info.get('subtitles') or {}
    auto_subs = info.get('automatic_captions') or {}

    sub_track = None
    lang_name = "English"

    # 1. Search for manual English subtitle
    for lang in ['en', 'en-US', 'en-GB']:
        if lang in subtitles:
            sub_track = subtitles[lang]
            lang_name = "English"
            break

    # 2. Search for any manual subtitle
    if not sub_track and subtitles:
        first_lang = list(subtitles.keys())[0]
        sub_track = subtitles[first_lang]
        lang_name = first_lang

    # 3. Search for auto-generated English subtitle
    if not sub_track:
        for lang in ['en', 'en-US', 'en-GB']:
            if lang in auto_subs:
                sub_track = auto_subs[lang]
                lang_name = "English (Auto-generated)"
                break

    # 4. Search for any auto-generated subtitle
    if not sub_track and auto_subs:
        first_lang = list(auto_subs.keys())[0]
        sub_track = auto_subs[first_lang]
        lang_name = f"{first_lang} (Auto-generated)"

    if not sub_track:
        raise ValueError(f"No subtitle or caption tracks found for video '{video_id}'.")

    # Pick format (json3 preferred, then vtt)
    target_url = None
    fmt_type = None

    for fmt in sub_track:
        if fmt.get('ext') == 'json3':
            target_url = fmt.get('url')
            fmt_type = 'json3'
            break
        elif fmt.get('ext') == 'vtt':
            target_url = fmt.get('url')
            fmt_type = 'vtt'

    if not target_url:
        target_url = sub_track[0].get('url')
        fmt_type = sub_track[0].get('ext', '')

    # Fetch track data
    req = urllib.request.Request(target_url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    with urllib.request.urlopen(req) as resp:
        content = resp.read().decode('utf-8')

    chunks = []
    text_parts = []

    if fmt_type == 'json3' or 'events' in content:
        data = json.loads(content)
        events = data.get('events', [])
        for event in events:
            t_start = event.get('tStartMs', 0) / 1000.0
            t_dur = event.get('dDurationMs', 0) / 1000.0
            segs = event.get('segs', [])
            line_text = "".join([s.get('utf8', '') for s in segs if s.get('utf8')]).strip()
            clean_text = line_text.replace('\n', ' ').strip()
            if clean_text:
                text_parts.append(clean_text)
                chunks.append({
                    "text": clean_text,
                    "start": round(t_start, 2),
                    "duration": round(t_dur, 2)
                })
    else:
        for line in content.splitlines():
            line_str = line.strip()
            if line_str and not line_str.startswith('WEBVTT') and '-->' not in line_str and not line_str.isdigit():
                clean_text = re.sub(r'<[^>]+>', '', line_str).strip()
                if clean_text:
                    text_parts.append(clean_text)
                    chunks.append({
                        "text": clean_text,
                        "start": 0.0,
                        "duration": 0.0
                    })

    full_transcript = " ".join(text_parts)
    if not full_transcript:
        raise ValueError("Extracted transcript content was empty.")

    return {
        "video_id": video_id,
        "language": lang_name,
        "transcript_text": full_transcript,
        "chunks": chunks,
        "char_count": len(full_transcript),
        "word_count": len(full_transcript.split())
    }


def fetch_transcript(video_id: str) -> Dict[str, Any]:
    """
    Fetches transcript for a given video ID in any language.
    Primary: YouTubeTranscriptApi
    Fallback: yt-dlp with mobile/web client spoofing to bypass cloud IP bans.
    """
    video_id = extract_video_id(video_id)
    
    # Try primary YouTubeTranscriptApi
    try:
        api = YouTubeTranscriptApi() if callable(YouTubeTranscriptApi) else YouTubeTranscriptApi
        
        try:
            transcript_list = api.list(video_id)
        except AttributeError:
            transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)

        transcript_obj = None
        language_info = "English"

        try:
            transcript_obj = transcript_list.find_transcript(['en', 'en-US', 'en-GB'])
            language_info = f"{transcript_obj.language}"
        except Exception:
            pass

        if not transcript_obj:
            try:
                transcript_obj = transcript_list.find_generated_transcript(['en', 'en-US', 'en-GB'])
                language_info = f"{transcript_obj.language}"
            except Exception:
                pass

        if not transcript_obj:
            available = list(transcript_list)
            if not available:
                raise ValueError(f"No captions or subtitles found for video '{video_id}'.")
            
            chosen = available[0]
            
            if chosen.language_code.startswith('en'):
                transcript_obj = chosen
                language_info = f"{chosen.language}"
            elif chosen.is_translatable:
                try:
                    transcript_obj = chosen.translate('en')
                    language_info = f"{chosen.language} (Auto-translated to English)"
                except Exception:
                    transcript_obj = chosen
                    language_info = f"{chosen.language}"
            else:
                transcript_obj = chosen
                language_info = f"{chosen.language}"

        transcript_items = transcript_obj.fetch()

        chunks = []
        text_parts = []
        
        for item in transcript_items:
            if isinstance(item, dict):
                t = item.get('text', '')
                start = item.get('start', 0.0)
                duration = item.get('duration', 0.0)
            else:
                t = getattr(item, 'text', str(item))
                start = getattr(item, 'start', 0.0)
                duration = getattr(item, 'duration', 0.0)
            
            clean_text = t.replace('\n', ' ').strip()
            if clean_text:
                text_parts.append(clean_text)
                chunks.append({
                    "text": clean_text,
                    "start": start,
                    "duration": duration
                })
        
        full_transcript = " ".join(text_parts)
        
        if not full_transcript:
            raise ValueError("Transcript fetched was empty.")

        return {
            "video_id": video_id,
            "language": language_info,
            "transcript_text": full_transcript,
            "chunks": chunks,
            "char_count": len(full_transcript),
            "word_count": len(full_transcript.split())
        }

    except (TranscriptsDisabled, VideoUnavailable):
        raise
    except Exception as primary_error:
        # If primary API fails or is IP blocked, try yt-dlp fallback
        try:
            return _fetch_transcript_ytdlp(video_id)
        except Exception as fallback_error:
            raise ValueError(f"Could not retrieve transcript via primary or fallback scrapers. Primary error: {str(primary_error)}. Fallback error: {str(fallback_error)}")

