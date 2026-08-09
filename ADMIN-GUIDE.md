# Arise Aura Admin Guide

Welcome to the Arise Aura Product Management System. This guide explains how to add, edit, and manage your products for free, directly from your browser.

## 1. Initial Setup (ONE-TIME DEVELOPER SETUP)

> **Note to Store Owner:** You do not need to do this! The developer setting up this repository will perform this step once. You can skip straight to Section 2.

Because this system runs entirely on free infrastructure without a traditional backend, the developer needs to configure GitHub and Vercel to allow the store owner to log in securely.

### Step A: Create a GitHub OAuth App
1. Go to your GitHub account settings: **Settings > Developer settings > OAuth Apps**.
2. Click **New OAuth App**.
3. Fill in the details:
   - **Application name**: Arise Aura CMS
   - **Homepage URL**: `https://ariseaura-simple-ecommerce.vercel.app` (Replace with your actual Vercel URL)
   - **Authorization callback URL**: `https://ariseaura-simple-ecommerce.vercel.app/api/callback`
4. Click **Register application**.
5. You will see a **Client ID**. Copy this.
6. Click **Generate a new client secret**. Copy this secret (you won't be able to see it again).

### Step B: Add Variables to Vercel
1. Go to your Vercel Dashboard and open the **ariseaura-simple-ecommerce** project.
2. Go to **Settings > Environment Variables**.
3. Add a new variable:
   - **Key**: `OAUTH_CLIENT_ID`
   - **Value**: (Paste the Client ID from GitHub)
4. Add another variable:
   - **Key**: `OAUTH_CLIENT_SECRET`
   - **Value**: (Paste the Client Secret from GitHub)
5. **Redeploy your Vercel site** so the environment variables take effect (Go to Deployments > Create Deployment, or simply push a change to GitHub).

---

## 2. Accessing the Admin Panel

1. Go to: `https://your-website-url.vercel.app/admin/login.html`
2. You will see a "Login with GitHub" button.
3. Click it and authorize the application. You are now in the Admin Dashboard!

## 3. Managing Products

### How to Add a Product
1. In the CMS dashboard, click on **Products** on the left menu.
2. Click **New Product** in the top right.
3. Fill in the details:
   - **ID**: A unique identifier (e.g., `p12`, `tshirt-black`).
   - **Product Name**: The display name.
   - **Price**: Numeric value in INR.
   - **Category**: Select from the dropdown.
   - **Sizes**: Add or remove available sizes (e.g., S, M, L).
   - **Image**: Upload an image.
4. Click **Publish** at the top.

### How to Edit a Product
1. Click on **Products** in the left menu.
2. Click on the product you want to edit.
3. Change the text, price, or image.
4. Click **Publish**.

### How to Delete a Product
1. Open the product you want to delete.
2. In the top right, click the arrow next to "Publish" and select **Delete**.

## 4. How Deployment Works

Every time you click **Publish** or **Delete**, the CMS automatically commits the change to your GitHub repository.

This triggers **Vercel** to rebuild your website automatically.
- **Wait time**: Usually 30 to 60 seconds.
- Refresh your website after a minute to see your changes!

## 5. Troubleshooting

- **Admin panel says "OAuth error" or doesn't log in:** Double-check your `OAUTH_CLIENT_ID` and `OAUTH_CLIENT_SECRET` in Vercel. Ensure your callback URL in GitHub exactly matches your domain.
- **I published a product but it's not on the website:** Wait one minute and refresh the page. Check your Vercel Dashboard to ensure the deployment was successful.
- **My images aren't showing:** Make sure you uploaded them through the CMS media library and that Vercel finished deploying.
