import base64
from openai import OpenAI
import argparse

client = OpenAI()

def encode_image(image_path):
  with open(image_path, "rb") as image_file:
    return base64.b64encode(image_file.read()).decode('utf-8')
def main(image_path):
  base64_image = encode_image(image_path)
  prompt=[
        {"role": "system", "content": '''You are a image feature summarizer. You job is give 5 natural lanugage words to describe the input image. For example, user is asking "summary this image" with input image. You should only response {"features": ["sunny", "sea", "circle", "comfortable", "green"]}
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

  print(response.choices[0].message.content)
if __name__=="__main__":
  parser = argparse.ArgumentParser(description="Process a file path input.")
  parser.add_argument(
      'file_path', 
      type=str, 
      help="The path to the file to process"
  )
  args = parser.parse_args()
  main(args.file_path)