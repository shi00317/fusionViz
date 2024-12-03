# import base64
# from openai import OpenAI
# import argparse
# import json

# client = OpenAI()

# def encode_image(image_path):
#     with open(image_path, "rb") as image_file:
#         return base64.b64encode(image_file.read()).decode('utf-8')

# def save_image_from_base64(base64_image, output_path):
#     with open(output_path, "wb") as image_file:
#         image_file.write(base64.b64decode(base64_image))

# def main(image_path, input_text, output_path):
#     base64_image = encode_image(image_path)
#     prompt = [
#         {
#             "role": "system",
#             "content": "You are a digital artist. Your job is to help me modify an image based on given instructions."
#         },
#         {
#             "role": "user",
#             "content": [
#                 {
#                     "type": "text",
#                     "text": f"Help me to modify this image by {input_text}"
#                 },
#                 {
#                     "type": "image_url",
#                     "image_url": {
#                         "url": f"data:image/jpeg;base64,{base64_image}"
#                     }
#                 }
#             ]
#         }
#     ]

#     response = client.chat.completions.create(
#         model="gpt-4o-mini",
#         messages=prompt,
#     )

#     # Get the response content
#     content = response.choices[0].message.content
#     print(content)
#     # Try to parse it as JSON, expecting it to contain a base64 image string
#     try:
#         result = json.loads(content)
#         modified_image_base64 = result.get("image_base64")
#         if modified_image_base64:
#             save_image_from_base64(modified_image_base64, output_path)
#             print(f"Modified image saved to {output_path}")
#         else:
#             print("No image found in the response.")
#     except json.JSONDecodeError:
#         print("Failed to parse the response as JSON.")

# if __name__ == "__main__":
#     parser = argparse.ArgumentParser(description="Modify an image based on user input.")
#     parser.add_argument(
#         'file_path', 
#         type=str, 
#         help="The path to the image file to process"
#     )
#     parser.add_argument(
#         'input_text',
#         type=str,
#         help="Text describing the modifications to apply to the image"
#     )
#     parser.add_argument(
#         'output_path',
#         type=str,
#         help="The path to save the modified image"
#     )

#     args = parser.parse_args()
#     main(args.file_path, args.input_text, args.output_path)


from openai import OpenAI

client = OpenAI()

def edit_image(image_path, mask_path, prompt, n=1, size="1024x1024"):
    with open(image_path, "rb") as image_file, open(mask_path, "rb") as mask_file:
        response = client.images.edit(
            model="dall-e-2",
            image=image_file,
            mask=mask_file,
            prompt=prompt,
            n=n,
            size=size,
        )
        return response

# Example usage
image_path = "../img_data/input/image2.jpg"
mask_path = "mask.png"
prompt = "A sunlit indoor lounge area with a pool containing a flamingo"

response = edit_image(image_path, mask_path, prompt)
image_url = response.data[0].url

print(f"Edited image available at: {image_url}")
