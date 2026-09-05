import re
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



def fetch_transcript(video_id: str) -> Dict[str, Any]:
    """
    Fetches transcript for a given video ID in any language.
    If transcript is in a non-English language, automatically translates it into English.
    Returns plain text transcript, language info, and structured raw transcript list.
    """
    video_id = extract_video_id(video_id)
    
    try:
        api = YouTubeTranscriptApi() if callable(YouTubeTranscriptApi) else YouTubeTranscriptApi
        
        # 1. List all available transcripts for this video
        try:
            transcript_list = api.list(video_id)
        except AttributeError:
            transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)

        transcript_obj = None
        language_info = "English"

        # Try finding direct manual English transcript
        try:
            transcript_obj = transcript_list.find_transcript(['en', 'en-US', 'en-GB'])
            language_info = f"{transcript_obj.language}"
        except Exception:
            pass

        # Try finding auto-generated English transcript
        if not transcript_obj:
            try:
                transcript_obj = transcript_list.find_generated_transcript(['en', 'en-US', 'en-GB'])
                language_info = f"{transcript_obj.language}"
            except Exception:
                pass

        # If no English transcript, grab ANY available transcript in any language
        if not transcript_obj:
            available = list(transcript_list)
            if not available:
                raise ValueError(f"No captions or subtitles found for video '{video_id}'.")
            
            chosen = available[0]
            
            # If already English, use directly; if non-English & translatable, translate to English
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

        # Fetch transcript items
        transcript_items = transcript_obj.fetch()

        # Normalize items list into text chunks
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

    except TranscriptsDisabled:
        raise ValueError(f"Subtitles/Captions are disabled for video '{video_id}'.")
    except NoTranscriptFound:
        raise ValueError(f"No subtitles found in any language for video '{video_id}'.")
    except VideoUnavailable:
        raise ValueError(f"Video '{video_id}' is unavailable or private.")
    except Exception as e:
        raise ValueError(f"Failed to fetch transcript: {str(e)}")
