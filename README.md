# Bayanihan Magazine — Web Prototype

High-fidelity prototype of a UI/UX redesign for [**Bayanihan**](https://www.instagram.com/bayanihanbufsa/), the student-run Filipino arts & fashion magazine affiliated with [BUFSA](https://bufsa.weebly.com/) (Boston University Filipino Student Association).

**🔗 Live demo:** https://pinn32.github.io/bayanihan-prototype/
**📃 Design concept:** https://github.com/Pinn32/em757-web-design-project

This is a static HTML/CSS/JS rebuild of our final design, originally prototyped in Figma for [EM757 Developing Interactivity](https://www.bu.edu/academics/com/courses/com-em-757/) at Boston University. For the full design process, research, and personas, see the [project repository](https://github.com/Pinn32/em757-web-design-project).

## Pages

| Page | File | Highlights |
| --- | --- | --- |
| Home | `index.html` | Swipe-to-reveal cover for the newly released issue |
| Issues | `issues.html` → `issue-detail.html` | Issue archive and detail view with spreads |
| Blogs/Works | `blogs.html`, `blogs-all.html` → `blog-post.html` | Blog listing, full archive, and article page with likes, comments, and share |
| Artist Community | `artists.html` | Artist contributor portal (prototype) |
| Our Team | `team.html` | Team behind the redesign |

Other interactive features include a search box with tag-based suggestions and issue/blog carousels.

## Running locally

No build step — it's a plain static site. Serve the folder and open it in a browser:

```sh
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Structure

```
├── index.html          # Home
├── issues.html         # Issues archive
├── issue-detail.html   # Single issue
├── blogs.html          # Blogs/Works landing
├── blogs-all.html      # All blogs
├── blog-post.html      # Single blog post
├── artists.html        # Artist community
├── team.html           # Our team
├── css/styles.css
├── js/                 # Interactions (reveal panel, carousels, search)
└── assets/             # Covers, spreads, photos, logo
```

## Credits

Designed by **Pinn, Mandy, Danica, and Junli** — Group 3, EM757 Developing Interactivity (Section A1), Fall 2025, Boston University.
