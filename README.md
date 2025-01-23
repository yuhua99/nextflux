# Nextflux

A modern RSS reader client for Miniflux built with React + Vite.

![preview](images/preview.png)

## ✨ Features

- 🚀 Fast and responsive UI built with NextUI
- 🌐 Connect to your Miniflux server
- 🔄 Automatic background sync with configurable intervals
- 📱 Mobile-friendly with PWA support
- 🌙 Light/Dark mode with multiple theme options
- 🌍 i18n support (English & Chinese)
- 👀 Mark as read on scroll
- 🎯 Rich reading experience
    - Custom font settings
    - Image gallery with touch gestures support
    - Podcast support
    - Video player support
- ⌨️ Keyboard shortcuts
- 📊 Feed management
    - OPML import
    - Category organization
    - Feed hiding

## 📸 Screenshot Galleries

<table>
    <tr>
        <td>Podcast
        </td>
        <td>YouTube
        </td>
    </tr>
    <tr>
        <td><img src=images/podcast.png width=600/></td>
        <td><img src=images/youtube.png width=600/></td>
    </tr>
    <tr>
        <td>Code Highlight
        </td>
        <td>Image Gallery
        </td>
    </tr>
    <tr>
        <td><img src=images/code.png width=600/></td>
        <td><img src=images/images.png width=600/></td>
    </tr>
     <tr>
        <td>Feed Management
        </td>
        <td>Settings
        </td>
    </tr>
    <tr>
        <td><img src=images/feed.png width=600/></td>
        <td><img src=images/settings.png width=600/></td>
    </tr>
    <tr>
        <td>Stone theme
        </td>
        <td>Responsive
        </td>
    </tr>
    <tr>
        <td><img src=images/stone.png width=600/></td>
        <td><img src=images/responsive.png width=600/></td>
    </tr>
    <tr>
        <td>Search
        </td>
        <td>Dark Mode
        </td>
    </tr>
    <tr>
        <td><img src=images/search.png width=600/></td>
        <td><img src=images/dark.png width=600/></td>
    </tr>
    <tr>
        <td>Mobile
        </td>
        <td>Windows
        </td>
    </tr>
    <tr>
        <td><img src=images/mobile.png width=600/></td>
        <td><img src=images/windows.png width=600/></td>
    </tr>
</table>

## 🛠️ Tech Stack

- React 18
- Vite
- TailwindCSS
- NextUI
- i18next
- IndexedDB
- Nanostores
- DayJS

## 🚀 Deployment

### Docker Deployment

Run with Docker using the following command:

```bash
docker run -d --name nextflux -p 3000:3000 --restart unless-stopped electh/nextflux:latest
```
### Cloudflare Pages Deployment

1. Fork this repository to your GitHub account
2. Create a new project in Cloudflare Pages
3. Select your forked repository
4. Select Framework preset: `React(Vite)`
5. Set build command: `npm run build`
6. Set build output directory: `dist`
7. Deploy and access through the Cloudflare-assigned domain

## 📝 Configuration

The app requires a Miniflux server to function. You'll need to provide:

- Server URL
- Username
- Password

## 🌍 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 📱 Mobile Support

The app is fully responsive and works well on mobile devices. It can also be installed as a PWA for a native app-like
experience.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.