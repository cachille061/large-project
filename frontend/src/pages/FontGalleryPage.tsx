export function FontGalleryPage() {
  const fonts = [
    // System Fonts
    {
      name: "System Sans (Default)",
      family: 'ui-sans-serif, system-ui, sans-serif',
      description: "Default system font - clean and readable",
      category: "System"
    },
    {
      name: "Monospace",
      family: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
      description: "Fixed-width font for code",
      category: "System"
    },

    // Popular Sans-Serif Fonts (Google Fonts)
    {
      name: "Roboto",
      family: '"Roboto", sans-serif',
      description: "Google's signature font - modern and friendly",
      category: "Sans-Serif"
    },
    {
      name: "Open Sans",
      family: '"Open Sans", sans-serif',
      description: "Optimized for print, web, and mobile",
      category: "Sans-Serif"
    },
    {
      name: "Lato",
      family: '"Lato", sans-serif',
      description: "Semi-rounded sans-serif - warm and stable",
      category: "Sans-Serif"
    },
    {
      name: "Montserrat",
      family: '"Montserrat", sans-serif',
      description: "Urban-inspired geometric sans-serif",
      category: "Sans-Serif"
    },
    {
      name: "Poppins",
      family: '"Poppins", sans-serif',
      description: "Geometric sans-serif - clean and modern",
      category: "Sans-Serif"
    },
    {
      name: "Raleway",
      family: '"Raleway", sans-serif',
      description: "Elegant sans-serif with thin lines",
      category: "Sans-Serif"
    },
    {
      name: "Nunito",
      family: '"Nunito", sans-serif',
      description: "Well-balanced, rounded sans-serif",
      category: "Sans-Serif"
    },
    {
      name: "Inter",
      family: '"Inter", sans-serif',
      description: "Designed for computer screens - highly legible",
      category: "Sans-Serif"
    },
    {
      name: "Source Sans 3",
      family: '"Source Sans 3", sans-serif',
      description: "Adobe's first open-source font",
      category: "Sans-Serif"
    },
    {
      name: "Ubuntu",
      family: '"Ubuntu", sans-serif',
      description: "Modern, humanist sans-serif",
      category: "Sans-Serif"
    },
    {
      name: "Quicksand",
      family: '"Quicksand", sans-serif',
      description: "Rounded, friendly display font",
      category: "Sans-Serif"
    },
    {
      name: "Archivo",
      family: '"Archivo", sans-serif',
      description: "Grotesque sans-serif for highlights and headlines",
      category: "Sans-Serif"
    },
    {
      name: "Oswald",
      family: '"Oswald", sans-serif',
      description: "Condensed sans-serif for headlines",
      category: "Sans-Serif"
    },
    {
      name: "Bebas Neue",
      family: '"Bebas Neue", sans-serif',
      description: "Bold, all-caps display font",
      category: "Sans-Serif"
    },

    // Serif Fonts (Google Fonts)
    {
      name: "Playfair Display",
      family: '"Playfair Display", serif',
      description: "High-contrast serif for titles",
      category: "Serif"
    },
    {
      name: "Merriweather",
      family: '"Merriweather", serif',
      description: "Designed to be pleasant to read on screens",
      category: "Serif"
    },
    {
      name: "Cormorant Garamond",
      family: '"Cormorant Garamond", serif',
      description: "Classic display serif",
      category: "Serif"
    },
    {
      name: "Crimson Text",
      family: '"Crimson Text", serif',
      description: "Inspired by old-style serif fonts",
      category: "Serif"
    },
    {
      name: "Georgia",
      family: 'Georgia, serif',
      description: "Classic serif font",
      category: "Serif"
    },
    {
      name: "Times New Roman",
      family: '"Times New Roman", Times, serif',
      description: "Traditional serif font",
      category: "Serif"
    },

    // Script & Display Fonts (Google Fonts)
    {
      name: "Dancing Script",
      family: '"Dancing Script", cursive',
      description: "Elegant script font - used in your app",
      category: "Script/Display"
    },
    {
      name: "Architects Daughter",
      family: '"Architects Daughter", cursive',
      description: "Handwritten style font - used in your app",
      category: "Script/Display"
    },
    {
      name: "Pacifico",
      family: '"Pacifico", cursive',
      description: "Retro surf script",
      category: "Script/Display"
    },
    {
      name: "Lobster",
      family: '"Lobster", cursive',
      description: "Bold script with personality",
      category: "Script/Display"
    },
    {
      name: "Anton",
      family: '"Anton", sans-serif',
      description: "Bold display font for impact",
      category: "Script/Display"
    },
    {
      name: "Fjalla One",
      family: '"Fjalla One", sans-serif',
      description: "Medium contrast display font",
      category: "Script/Display"
    },

    // Classic System Fonts
    {
      name: "Trebuchet MS",
      family: '"Trebuchet MS", "Segoe UI", sans-serif',
      description: "Microsoft sans-serif - used in your app",
      category: "System"
    },
    {
      name: "Arial",
      family: 'Arial, Helvetica, sans-serif',
      description: "Universal sans-serif",
      category: "System"
    },
    {
      name: "Verdana",
      family: 'Verdana, Geneva, sans-serif',
      description: "Wide, readable sans-serif",
      category: "System"
    },
    {
      name: "Segoe UI",
      family: '"Segoe UI", Tahoma, sans-serif',
      description: "Microsoft's modern sans-serif",
      category: "System"
    },
    {
      name: "Courier New",
      family: '"Courier New", Courier, monospace',
      description: "Typewriter-style monospace",
      category: "System"
    },
    {
      name: "Comic Sans MS",
      family: '"Comic Sans MS", "Comic Sans", cursive',
      description: "Casual, informal font",
      category: "System"
    }
  ];

  const sampleText = "The quick brown fox jumps over the lazy dog";
  const sampleNumbers = "0123456789";

  // Group fonts by category
  const categories = ["Sans-Serif", "Serif", "Script/Display", "System"];
  const groupedFonts = categories.map(category => ({
    category,
    fonts: fonts.filter(f => f.category === category)
  }));

  return (
    <main className="flex-1 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#1C3D51' }}>
            Font Gallery
          </h1>
          <p className="text-lg text-black mb-4">
            Explore {fonts.length} different fonts available in your application
          </p>
          <div className="flex gap-2 flex-wrap">
            <span className="px-3 py-1 bg-blue-100 rounded-full text-sm">
              ✓ {fonts.filter(f => f.category === "Sans-Serif").length} Sans-Serif
            </span>
            <span className="px-3 py-1 bg-green-100 rounded-full text-sm">
              ✓ {fonts.filter(f => f.category === "Serif").length} Serif
            </span>
            <span className="px-3 py-1 bg-purple-100 rounded-full text-sm">
              ✓ {fonts.filter(f => f.category === "Script/Display").length} Script/Display
            </span>
            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
              ✓ {fonts.filter(f => f.category === "System").length} System
            </span>
          </div>
        </div>

        {groupedFonts.map(({ category, fonts: categoryFonts }) => (
          <div key={category} className="mb-12">
            <h2 className="text-3xl font-bold mb-6" style={{ color: '#285570' }}>
              {category} Fonts
            </h2>
            <div className="space-y-6">
              {categoryFonts.map((font, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="mb-4">
                    <h3 className="text-2xl font-semibold mb-1" style={{ color: '#285570' }}>
                      {font.name}
                    </h3>
                    <p className="text-sm text-black mb-2">
                      {font.description}
                    </p>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      font-family: {font.family}
                    </code>
                  </div>

                  <div className="space-y-4 border-t pt-4">
                    {/* Large sample */}
                    <div>
                      <p className="text-xs font-semibold mb-2 text-black">
                        Large (48px)
                      </p>
                      <p
                        style={{
                          fontFamily: font.family,
                          fontSize: '48px',
                          lineHeight: '1.2'
                        }}
                      >
                        {sampleText}
                      </p>
                    </div>

                    {/* Medium sample */}
                    <div>
                      <p className="text-xs font-semibold mb-2 text-black">
                        Medium (24px)
                      </p>
                      <p
                        style={{
                          fontFamily: font.family,
                          fontSize: '24px',
                          lineHeight: '1.4'
                        }}
                      >
                        {sampleText}
                      </p>
                    </div>

                    {/* Regular sample */}
                    <div>
                      <p className="text-xs font-semibold mb-2 text-black">
                        Regular (16px)
                      </p>
                      <p
                        style={{
                          fontFamily: font.family,
                          fontSize: '16px',
                          lineHeight: '1.6'
                        }}
                      >
                        {sampleText}
                      </p>
                    </div>

                    {/* Small sample */}
                    <div>
                      <p className="text-xs font-semibold mb-2 text-black">
                        Small (12px)
                      </p>
                      <p
                        style={{
                          fontFamily: font.family,
                          fontSize: '12px',
                          lineHeight: '1.5'
                        }}
                      >
                        {sampleText}
                      </p>
                    </div>

                    {/* Numbers */}
                    <div>
                      <p className="text-xs font-semibold mb-2 text-black">
                        Numbers
                      </p>
                      <p
                        style={{
                          fontFamily: font.family,
                          fontSize: '32px',
                          lineHeight: '1.2'
                        }}
                      >
                        {sampleNumbers}
                      </p>
                    </div>

                    {/* Bold and Italic */}
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs font-semibold mb-2 text-black">
                          Bold
                        </p>
                        <p
                          style={{
                            fontFamily: font.family,
                            fontSize: '18px',
                            fontWeight: 'bold'
                          }}
                        >
                          Bold Text
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold mb-2 text-black">
                          Italic
                        </p>
                        <p
                          style={{
                            fontFamily: font.family,
                            fontSize: '18px',
                            fontStyle: 'italic'
                          }}
                        >
                          Italic Text
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold mb-2 text-black">
                          Bold Italic
                        </p>
                        <p
                          style={{
                            fontFamily: font.family,
                            fontSize: '18px',
                            fontWeight: 'bold',
                            fontStyle: 'italic'
                          }}
                        >
                          Bold Italic
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
