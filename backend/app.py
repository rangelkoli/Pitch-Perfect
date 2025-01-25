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
base_url = os.environ.get('AIML_BASE_URL')
api_key = os.environ.get('AIML_API_KEY')

api = OpenAI(api_key=api_key, base_url=base_url)

genai.configure(api_key=os.environ.get('GEMINI_API_KEY'))

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

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

prompts = {
    "describe_video": "I want you to describe the video",
    "generate_presentation_script": "Based on the given script/topic i want you to generate a 10 min presentation script. Give me the response in html format, only give me the script, no need to give me the slides",
    "generate_live_feedback": "Based on the given few seconds of video i want you to check if the user is doing anything wrong while presenting and if so i want you to give the user a 1 line feedback of what the user should do correctly and also give a score, else i want you to just give score out of 100",
    "generate_script_system_prompt": "You are a AI assistant that helps users generate presentation scripts. Based on the given script/topic, generate a 10 min presentation script. Give me the response in html format, only give me the script, no need to give me the slides",

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
        model='deepseek/deepseek-r1',
        messages=[
            {"role": "system", "content": prompts['generate_script_system_prompt'] + text},
            {"role": "user", "content": prompt},
        ],
      )

      response = model.generate_content([prompt], request_options={"timeout": 600})
      return {
          "response": response.candidates[0].content.parts[0].text,
          "completion": completion.choices[0].message.content
      }
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/analyze', methods=['POST'])
async def analyze_video():
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
        prompt = "I Want you to describe the video "
        response =  model.generate_content([video_file, prompt], request_options={"timeout": 600})

        print(response)

        # Delete the video file
        os.remove(filepath)

        # Delete the video from the gmemni server
        genai.delete_file(video_file.name)

        return jsonify(response.candidates[0].content.parts[0].text)
    except Exception as e:
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
