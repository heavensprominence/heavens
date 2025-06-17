import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const uploadType = (formData.get("type") as string) || "general"
    const userId = formData.get("userId") as string

    if (!file) {
      return NextResponse.json({ message: "No file provided" }, { status: 400 })
    }

    // Validate file type and size
    const allowedTypes = {
      image: ["image/jpeg", "image/png", "image/webp", "image/gif"],
      document: [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ],
      general: ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"],
    }

    const maxSizes = {
      image: 5 * 1024 * 1024, // 5MB
      document: 10 * 1024 * 1024, // 10MB
      general: 5 * 1024 * 1024, // 5MB
    }

    const typeCategory = uploadType as keyof typeof allowedTypes
    if (!allowedTypes[typeCategory]?.includes(file.type)) {
      return NextResponse.json(
        {
          message: `File type ${file.type} not allowed for ${uploadType}`,
        },
        { status: 400 },
      )
    }

    if (file.size > maxSizes[typeCategory]) {
      return NextResponse.json(
        {
          message: `File size exceeds limit of ${maxSizes[typeCategory] / 1024 / 1024}MB`,
        },
        { status: 400 },
      )
    }

    // Create upload directory structure
    const uploadDir = join(process.cwd(), "public", "uploads", uploadType)
    await mkdir(uploadDir, { recursive: true })

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const extension = file.name.split(".").pop()
    const filename = `${timestamp}-${randomString}.${extension}`
    const filepath = join(uploadDir, filename)

    // Save file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)

    // Generate public URL
    const publicUrl = `/uploads/${uploadType}/${filename}`

    // Log upload activity
    if (userId) {
      try {
        const { sql } = await import("@/lib/db")
        await sql`
          INSERT INTO admin_actions (admin_id, action_type, details, notes)
          VALUES (
            ${userId}, 'file_upload',
            ${JSON.stringify({
              filename: file.name,
              size: file.size,
              type: file.type,
              uploadType,
              publicUrl,
            })},
            'File uploaded successfully'
          )
        `
      } catch (error) {
        // Ignore logging errors
        console.warn("Could not log upload activity:", error)
      }
    }

    return NextResponse.json({
      message: "File uploaded successfully",
      url: publicUrl,
      filename,
      size: file.size,
      type: file.type,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ message: "Upload failed" }, { status: 500 })
  }
}
