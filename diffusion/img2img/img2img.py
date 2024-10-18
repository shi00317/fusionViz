from diffusers import StableDiffusionImg2ImgPipeline
from PIL import Image
import torch
torch.manual_seed(1234)
# Load the image-to-image pipeline
# img2img_pipe = StableDiffusionImg2ImgPipeline.from_pretrained("runwayml/stable-diffusion-v1-5",cache_dir = "./model", torch_dtype=torch.float16)
# img2img_pipe = StableDiffusionImg2ImgPipeline.from_pretrained("stabilityai/stable-diffusion-2-1",cache_dir = "./model", torch_dtype=torch.float32)
img2img_pipe = StableDiffusionImg2ImgPipeline.from_pretrained("timbrooks/instruct-pix2pix",cache_dir = "./model", torch_dtype=torch.float32)
img2img_pipe = img2img_pipe.to("mps")
img2img_pipe.enable_attention_slicing()

# Load and preprocess the input image
input_image = Image.open("1.png").convert("RGB").resize((512, 512))
# input_image = Image.open("2.png").convert("RGB").resize((512, 512))

# Generate new image from input image

# prompt = "A fusion of this images, need to be show both logo in one image. where the first logo is in the middle and the second logo is on the bottom."
prompt = "A fusion of this images, need to use both logo and create new image. where the first logo is in the middle and the second logo is on the bottom right. output should be no boundry and be realistic and both logo are same important."
# prompt = "turn him into a cyborg and be realistic"
image = img2img_pipe(
    prompt=prompt,
    image=input_image,
    strength=0.7,
    guidance_scale=9.5,
    num_inference_steps=50,  
).images[0]

# Save the generated image
image.save("output.png")