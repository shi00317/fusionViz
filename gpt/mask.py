from PIL import Image, ImageDraw

def create_mask(image_path, output_path, mask_coordinates):
    # Open the original image
    image = Image.open(image_path)
    
    # Create a blank image (same size) for the mask
    mask = Image.new("L", image.size, 0)  # "L" mode for grayscale
    
    # Draw white areas on the mask
    draw = ImageDraw.Draw(mask)
    for coord in mask_coordinates:
        draw.rectangle(coord, fill=255)  # White rectangle for editable area
    
    # Save the mask image
    mask.save(output_path)
    print(f"Mask saved at {output_path}")

# Example usage
image_path = "../img_data/input/image2.jpg"
output_path = "mask.png"
mask_coordinates = [(50, 50, 200, 200)]  # List of rectangles (x1, y1, x2, y2)

create_mask(image_path, output_path, mask_coordinates)
