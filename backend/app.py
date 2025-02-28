# Backend: Flask Server
from flask import Flask, request, jsonify, Response
import cv2
import numpy as np
import os
from flask_cors import CORS
import os
import google.generativeai as genai
import time
from openai import OpenAI
import os
from supabase import create_client, Client
from blueprints.crewAi.crewAi import crew_ai_blueprint

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)


base_url = os.environ.get('AIML_BASE_URL')
api_key = os.environ.get('AIML_API_KEY')

api = OpenAI(api_key=api_key, base_url=base_url)

genai.configure(api_key=os.environ.get('GEMINI_API_KEY'))

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

app.register_blueprint(crew_ai_blueprint)
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Create the model
generation_config = {
  "temperature": 1,
  "top_p": 0.95,
  "top_k": 40,
  "max_output_tokens": 8192,
  "response_mime_type": "text/plain",
}
model = genai.GenerativeModel(
  model_name="gemini-2.0-flash-exp",
  generation_config=generation_config,
)

chat_session = model.start_chat(
  history=[
  ]
)

videoUsers = {
    "user1": [
        {
            1: "video.com"
        }
    ]
}

prompts = {
    "describe_video": "I want you to describe the video",
    "generate_presentation_script": "Based on the given script/topic i want you to generate a 10 min presentation script. Give me the response in html format, only give me the script, no need to give me the slides",
    "generate_script_system_promptMain": """
You are an expert in presentation skills, specializing in analyzing body language, tone, gestures, eye contact, pacing, and overall delivery. The user has provided a video clip of their presentation along with the corresponding script.

Your task:

Analyze the clip and compare the user's delivery to the script.
Identify areas where the user needs to improve, including:
Gesture usage (too little, too much, or mismatched gestures).
Body language (posture, movement, facial expressions).
Voice modulation (tone, volume, pace, or clarity).
Eye contact (too much, too little, or inappropriate focus).
Provide actionable feedback in concise bullet points.
If no changes are needed and the presentation is perfect, respond with "Nothing to change."

Input:

Video clip of the presentation.
Script of the presentation.
Output:

List 1 feedback point or "Nothing to change" if the presentation is flawless.""",
    "generate_script_system_prompt": "You are a AI assistant that helps users generate presentation scripts. Based on the given script/topic, generate a 10 min presentation script. Give me the response in html format, only give me the script, no need to give me the slides",
    "generate_presentation_slides": "Based on the given script/topic i want you to generate a 10 min presentation slides. Give me the response in html format, only give me the slides, no need to give me the script",
    
}

@app.route('/generate_presentation_script', methods=['POST'])
def generate_presentation_script():
    try:
      # Get the file from the user or get the text 
      text = request.json['text']
      print(text)

      if text:
        prompt = prompts['generate_presentation_script'] + text
      completion = api.chat.completions.create(
        model='gemini-2.0-flash-exp',
        messages=[
            {"role": "system", "content": prompts['generate_script_system_prompt'] + text},
            {"role": "user", "content": prompt},
        ],
        max_tokens=8192,
      )

      slides = api.chat.completions.create(
      model='gemini-2.0-flash-exp',
        messages=[
            {"role": "system", "content": prompts['generate_presentation_slides'] + text},
            {"role": "user", "content": prompt},
        ],
        max_tokens=8192,
      )


      # response = model.generate_content([prompt], request_options={"timeout": 600})
      return {
          "completion": completion.choices[0].message.content,
          "slides": slides.choices[0].message.content
      }
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500

@app.route('/analyze', methods=['POST'])
async def analyze_video():
    try:
        # Get the video file from the request
        file = request.files['video']
        filepath = os.path.join(UPLOAD_FOLDER, 'clip.webm')
        file.save(filepath)
        count = len(videoUsers["user1"]) + 1
        username = "user1"
        print(count)
        # response = supabase.storage.from_('video_files').upload(f'{username}{count}.webm', filepath)

        # print(response)
        print(f'{username}{count}.webm')
        filename = f'{username}{count}'
        filename = filename.replace(" ", "_")
        filename = filename.lower().replace("-", "_")
        video_file = genai.upload_file(path=filepath, name=filename)

        videoUsers[username].append({count: f'{username}{count}.webm'})

        print(video_file)
        print(videoUsers)

        # res = api.chat.completions.create(
        #     model='gemini-2.0-flash-exp',
        #     messages=[
        #         {"role": "system", "content": prompts['describe_video']},
        #         {"role": "user", "content": "I want you to describe the video"},
        #     ],
        #     max_tokens=8192,  
        #     )

        # Check whether the file is ready to be used.
        while video_file.state.name == "PROCESSING":
            print('.', end='')
            time.sleep(1)
            video_file = genai.get_file(video_file.name)
        print(video_file)
        if not video_file:
            return jsonify({"error": "Failed to upload file"}), 500
        prompt = prompts['generate_script_system_promptMain']
        response = model.generate_content([prompt, video_file], request_options={"timeout": 600})

        print(response)

        # Delete the video file
        os.remove(filepath)

        # Delete the video from the gmemni server
        genai.delete_file(video_file.name)

        return jsonify(response.candidates[0].content.parts[0].text)
        return jsonify(response)
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500



@app.route('/analzye-presentation', methods=['POST'])
async def analyze_presentation():
    try:
        # Get the video file from the request
        file = request.files['video']
        filepath = os.path.join(UPLOAD_FOLDER, 'clip.webm')
        file.save(filepath)

        video_file = genai.upload_file(path=filepath)
        # Check whether the file is ready to be used.
        while video_file.state.name == "PROCESSING":
            print('.', end='')
            time.sleep(1)
            video_file = genai.get_file(video_file.name)
        print(video_file)
        if not video_file:
            return jsonify({"error": "Failed to upload file"}), 500
        prompt = "I Want you to generate a 10 min presentation script based on the given video"
        response = "success"

        print(response)

        # Delete the video file
        os.remove(filepath)

        # Delete the video from the gmemni server
        genai.delete_file(video_file.name)

        return jsonify(response.candidates[0].content.parts[0].text)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
