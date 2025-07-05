import yaml
import os

# --- Configuration ---
PROJECTS_FILE = "projects.yaml"
TEMPLATE_FILE = "index.template.html"
OUTPUT_DIR = "dist"
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "index.html")

def generate_html_items(items, base_url):
    """Recursively generates HTML list items from the project structure."""
    html = ""
    # Sort to ensure folders are on top
    sorted_items = sorted(items, key=lambda x: x.get('type') == 'project')
    
    for item in sorted_items:
        if item.get("type") == "folder":
            html += "<li>\n<details>\n"
            html += f"<summary>{item['name']}</summary>\n<ul>\n"
            html += generate_html_items(item.get("children", []), base_url)
            html += "</ul>\n</details>\n</li>\n"
        elif item.get("type") == "project":
            project_name = item['name']
            version_badge = f"<span class=\"version-badge\">{item['version']}</span>" if item.get('version') else ""
            full_url = f"{base_url}/{item['path']}/index.html"
            has_info = "true" if item.get('has_info') else "false"
            
            html += "<li>\n"
            html += f"<a href=\"{full_url}\" target=\"project-frame\" data-has-info=\"{has_info}\" data-project-name=\"{project_name}\">\n"
            
            # This line removes the version from the display name
            display_name = project_name.replace(f' {item.get("version", "")}'.strip(), '')
            html += f"<span>{display_name}</span>\n"
            
            html += f"{version_badge}\n</a>\n</li>\n"
    return html

def main():
    """Main function to build the final HTML file."""
    print("Reading project data...")
    with open(PROJECTS_FILE, 'r', encoding="utf-8") as f:
        config = yaml.safe_load(f)

    print("Generating project list HTML...")
    project_html = generate_html_items(config.get("projects", []), config.get("r2_base_url", ""))

    print("Reading HTML template...")
    with open(TEMPLATE_FILE, 'r', encoding="utf-8") as f:
        template = f.read()

    print("Injecting project list into template...")
    # --- THIS IS THE CORRECTED LINE ---
    # It now correctly finds and replaces the placeholder comment.
    final_html = template.replace("TEMP", project_html)
    
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    with open(OUTPUT_FILE, 'w', encoding="utf-8") as f:
        f.write(final_html)
        
    print(f"Successfully generated '{OUTPUT_FILE}'")

if __name__ == "__main__":
    main()