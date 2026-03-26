Generate social media / Open Graph images for blog posts.

## What this does

Runs `node scripts/generate-blog-og-images.mjs` to generate OG images for blog posts. Each image features:
- A unique generative grid pattern seeded from the post title
- The post title in large uppercase text
- Category label in red
- Date and site URL
- Dark brutalist aesthetic matching the site design

Images are saved to `src/assets/og/{slug}.png` (1200x630px).

## Usage

- Run without arguments to generate images for posts that don't have one yet
- Pass `--force` to regenerate all images
- Pass a slug name to generate for a specific post

## Steps

1. Run the generation script:
   ```bash
   node scripts/generate-blog-og-images.mjs
   ```
2. After generation, check the output in `src/assets/og/` to verify the images look correct
3. If the user wants to regenerate all images, run with `--force`:
   ```bash
   node scripts/generate-blog-og-images.mjs --force
   ```
4. To generate for a specific post:
   ```bash
   node scripts/generate-blog-og-images.mjs my-post-slug
   ```

## After generating

Remind the user that to use these images, blog posts need `heroImage` in their frontmatter pointing to the generated image:
```yaml
heroImage: ../../assets/og/post-slug.png
```

The `heroImage` is already used as the OG image in `BaseHead.astro`, so setting it will automatically update social sharing previews.
