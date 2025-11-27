package com.spacecap.tradingjournal.controller

import org.springframework.core.io.Resource
import org.springframework.core.io.UrlResource
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import java.nio.file.Files
import java.nio.file.Paths
import java.util.UUID

@RestController
@RequestMapping("/api/images")
class ImageController {

    private val uploadDir = Paths.get("uploads")

    init {
        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir)
        }
    }

    @PostMapping
    fun uploadImage(@RequestParam("file") file: MultipartFile): ResponseEntity<Map<String, String>> {
        if (file.isEmpty) {
            return ResponseEntity.badRequest().build()
        }

        val filename = "${UUID.randomUUID()}_${file.originalFilename}"
        val targetLocation = uploadDir.resolve(filename)
        Files.copy(file.inputStream, targetLocation)

        val imageUrl = "/api/images/$filename"
        return ResponseEntity.ok(mapOf("url" to imageUrl))
    }

    @GetMapping("/{filename:.+}")
    fun serveFile(@PathVariable filename: String): ResponseEntity<Resource> {
        val file = uploadDir.resolve(filename)
        val resource = UrlResource(file.toUri())

        if (resource.exists() || resource.isReadable) {
            val contentType = Files.probeContentType(file) ?: "application/octet-stream"
            return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .body(resource)
        } else {
            return ResponseEntity.notFound().build()
        }
    }
}
