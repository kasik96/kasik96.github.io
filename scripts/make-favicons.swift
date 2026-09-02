// Renders the site's emoji favicon into every size the page asks for, using the
// system emoji font through AppKit. Run with:  npm run icons
//
// Drawing goes straight into an NSBitmapImageRep so the output is exactly the
// requested pixel size — lockFocus() on an NSImage would silently give back a
// 2x bitmap on a Retina display.

import AppKit
import Foundation

let emoji = "👨🏻‍💻" // man technologist, light skin tone
let outDir = CommandLine.arguments.count > 1 ? CommandLine.arguments[1] : "assets"

struct Icon {
	let name: String
	let size: Int
	let background: NSColor?
}

let icons: [Icon] = [
	Icon(name: "favicon-16x16.png", size: 16, background: nil),
	Icon(name: "favicon-32x32.png", size: 32, background: nil),
	// iOS ignores alpha and composites on black, so give these a light ground.
	Icon(name: "apple-touch-icon.png", size: 180, background: .white),
	Icon(name: "android-chrome-192x192.png", size: 192, background: .white),
	Icon(name: "android-chrome-512x512.png", size: 512, background: .white),
]

func render(_ icon: Icon) -> Data? {
	let px = CGFloat(icon.size)
	guard
		let rep = NSBitmapImageRep(
			bitmapDataPlanes: nil,
			pixelsWide: icon.size,
			pixelsHigh: icon.size,
			bitsPerSample: 8,
			samplesPerPixel: 4,
			hasAlpha: true,
			isPlanar: false,
			colorSpaceName: .deviceRGB,
			bytesPerRow: 0,
			bitsPerPixel: 0,
		)
	else { return nil }
	rep.size = NSSize(width: px, height: px)

	NSGraphicsContext.saveGraphicsState()
	NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: rep)

	if let background = icon.background {
		background.setFill()
		NSRect(x: 0, y: 0, width: px, height: px).fill()
	}

	// Emoji glyphs carry their own padding, so 88% of the box lands about right.
	let font = NSFont(name: "Apple Color Emoji", size: px * 0.88)
		?? NSFont.systemFont(ofSize: px * 0.88)
	let string = NSAttributedString(string: emoji, attributes: [.font: font])
	let measured = string.size()
	string.draw(
		in: NSRect(
			x: (px - measured.width) / 2,
			y: (px - measured.height) / 2,
			width: measured.width,
			height: measured.height,
		),
	)

	NSGraphicsContext.restoreGraphicsState()
	return rep.representation(using: .png, properties: [:])
}

for icon in icons {
	guard let png = render(icon) else {
		FileHandle.standardError.write("failed to render \(icon.name)\n".data(using: .utf8)!)
		exit(1)
	}
	let url = URL(fileURLWithPath: outDir).appendingPathComponent(icon.name)
	try! png.write(to: url)
	print("wrote \(url.path) (\(icon.size)x\(icon.size), \(png.count) bytes)")
}
