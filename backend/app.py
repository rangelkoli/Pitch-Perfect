# Backend: Flask Server
from flask import Flask, request, jsonify, Response
import cv2
import numpy as np
import os
from flask_cors import CORS
import os
import google.generativeai as genai
import time

genai.configure(api_key="AIzaSyDMw8Fj4eFNVr_MPwujDFW7W9FtHE_8hyw")

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
        prompt = "I Want you to describe the video in one line"
        response =  model.generate_content([video_file, prompt], request_options={"timeout": 600})

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
