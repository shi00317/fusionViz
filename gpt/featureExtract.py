import base64
from openai import OpenAI
import argparse
import json

client = OpenAI()

def encode_image(image_path):
  with open(image_path, "rb") as image_file:
    return base64.b64encode(image_file.read()).decode('utf-8')
def main(image_path):

  base64_image = encode_image(image_path)
  prompt=[
      {"role": "system", "content": '''You are an image feature summarizer. Your job is to give 5 natural language words to describe the input image. For example, user is asking "summary this image" with input image. You should only respond {"features": ["sunny", "sea", "circle", "comfortable", "green"]}
        '''},
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": "summary this image",
          },
          # {
          #   "type": "image_url",
          #   "image_url": {
          #     "url":  f"data:image/jpeg;base64,```THIS_IS_AN_EXAMPLE```"
          #   },
          # },
        ],
      },
      {
        "role": "assistant",
        "content": [
          {
            "type": "text",
            "text": '{"features": ["sunny", "sea", "circle", "comfortable", "green"]}',
          },
        ],
      }
  ]
  prompt.append(
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": "summary this image",
          },
          {
            "type": "image_url",
            "image_url": {
              "url":  f"data:image/jpeg;base64,{base64_image}"
            },
          },
        ],
      }
    )

  response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=prompt,
  )

  # Get the response content
  content = response.choices[0].message.content
  
  # Try to parse it as JSON, if it's not already JSON format
  try:
    features = json.loads(content)
  except json.JSONDecodeError:
    # If it's not valid JSON, create a proper JSON structure
    features = {"features": [content.strip()]}

  # Ensure we output valid JSON
  print(json.dumps(features))
  return features

  # except Exception as e:
  #   error_response = {"error": str(e)}
  #   print(json.dumps(error_response))
  #   return error_response
if __name__=="__main__":
  parser = argparse.ArgumentParser(description="Process a file path input.")
  parser.add_argument(
      'file_path', 
      type=str, 
      help="The path to the file to process"
  )
  args = parser.parse_args()
  main(args.file_path)