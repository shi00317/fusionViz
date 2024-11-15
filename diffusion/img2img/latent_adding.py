from diffusers import StableDiffusionPipeline, StableDiffusionImg2ImgPipeline
from PIL import Image
import torch

# Load the text-to-image pipeline for embedding extraction
txt2img_pipe = StableDiffusionPipeline.from_pretrained("runwayml/stable-diffusion-v1-5", torch_dtype=torch.float16)
txt2img_pipe = txt2img_pipe.to("mps")
txt2img_pipe.enable_attention_slicing()

# Load the image-to-image pipeline for final generation
img2img_pipe = StableDiffusionImg2ImgPipeline.from_pretrained("runwayml/stable-diffusion-v1-5", torch_dtype=torch.float16)
img2img_pipe = img2img_pipe.to("mps")
img2img_pipe.enable_attention_slicing()

# Function to get image embedding
def get_image_embedding(image_path):
    image = Image.open(image_path).convert("RGB").resize((512, 512))
    # Process the image
    image = txt2img_pipe.image_processor.preprocess(image)
    # Convert image to float16 and move to MPS
    image = image.to(dtype=torch.float16, device="mps")
    # Get the embedding (latent representation) of the image
    latents = txt2img_pipe.vae.encode(image).latent_dist.sample()
    return latents

# Get embeddings for both images
embedding1 = get_image_embedding("1.png")
embedding2 = get_image_embedding("2.png")

# Combine embeddings (simple addition in this case)
combined_embedding = (embedding1 + embedding2)/2  # Average the embeddings
# combined_embedding = torch.sum(embedding1 * embedding2) / (torch.norm(embedding1) * torch.norm(embedding2))  # Normalized tensor dot product

# Generate new image from combined embedding
prompt = "current latent feature is create by adding two different image latent feature together. Creating new image use both features and make the output real and logolized"
image = img2img_pipe(
    prompt=prompt,
    image=txt2img_pipe.vae.decode(combined_embedding / txt2img_pipe.vae.config.scaling_factor).sample,
    strength=0.75,
    guidance_scale=7.5
).images[0]

# Save the generated image
image.save("3.png")