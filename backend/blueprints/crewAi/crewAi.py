from flask import Blueprint
from crewai import Agent, Task, Crew, LLM
from langchain_openai import ChatOpenAI
from langchain_google_genai import ChatGoogleGenerativeAI
from crewai_tools import SerperDevTool
import os
from pydantic import BaseModel


class GenerateScript(BaseModel):
    topic: str

os.environ["OPENAI_API_KEY"] = "sk-proj-1111"
os.environ["GEMINI_API_KEY"] = "AIzaSyDMw8Fj4eFNVr_MPwujDFW7W9FtHE_8hyw"
os.environ["SERPER_API_KEY"] = "f9abe9912b267145d315e3aa9d64f77e22402331"

# Create a blueprint object
crew_ai_blueprint = Blueprint('crew_ai', __name__)

# Define your Agents, Tasks, and Crews here


research_reactpptx = Agent(
    role="Research Analyst",
    goal="Research the parameters and components of the given github repo",
    backstory="""
        You are being given a github repo link https://github.com/wyozi/react-pptx, i want you to research the parameters and components of the given github repo
        """,
    llm="gemini/gemini-2.0-flash-exp",
    tools=[SerperDevTool()],

)

researchTopicOrScript = Agent(
    role="Research Analyst",
    goal="Research the given topic or script {topic}",
    backstory="""
        You are being given a topic {topic}, I want you to research the topic and get knowledge about the topic or the give script
    """,
    llm="gemini/gemini-2.0-flash-exp",
    tools=[SerperDevTool()],
)

generate_presentation_script = Agent(
    role="Presentation Script Generator",
    goal="Generate a 10 min presentation script based on the given script/topic {topic}",
    backstory="""
        You are being given a script or a topic, I want you to generate a 10 min presentation script based on the given script/topic. Give me the response based on the knowledge from the github repo and make sure that the code is complete and valid format, only give me the script, no need to give me the slides
    """,
    llm="gemini/gemini-2.0-flash-exp",
    tools=[SerperDevTool()],

)

reactpptData = Task(
    name="Reactxppt Knowledge",
    description="Research the parameters and components of the given github repo",
    agents=[research_reactpptx],
    expected_output="Detailed knowledge about the given github repo, details about all the parameters and functions ",
)

researchTopicOrScript = Task(
    name="Research Topic/Script",
    description="Research the given topic or script {topic}",
    agents=[researchTopicOrScript],
    expected_output="Detailed knowledge about the given topic/script",
)

generatePresentationScript = Task(
    name="Generate Presentation Script",
    description="Generate a 10 min presentation script based on the given script/topic {topic}",
    agents=[generate_presentation_script],
    context=[researchTopicOrScript, reactpptData],
    output_pydantic=GenerateScript,
    expected_output="10 min presentation script based on the given script/topic {topic}",

)

crew = Crew(
    tasks=[reactpptData, researchTopicOrScript, generatePresentationScript],
)

llm = LLM(
    llm="gemini/gemini-2.0-flash-exp",
    tools=[SerperDevTool()],
)




# Example route
@crew_ai_blueprint.route('/crew_ai/genscript', methods=['POST'])
def hello():
    topic = "AI"
    response = crew.kickoff(inputs={'topic': 'AI Agents'})
    return response

    return 'Hello, Crew AI!'

