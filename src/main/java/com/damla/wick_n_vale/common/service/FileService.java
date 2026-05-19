package com.damla.wick_n_vale.common.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
public class FileService {

    @Value("${file.upload.base-dir:uploads}")
    private String baseDir;

    @Value("${server.base-url:http://localhost:8080}")
    private String baseUrl;

    /**
     * Dosyayı kaydeder ve URL'ini döndürür
     */
    public String saveFile(MultipartFile file, String subDirectory) {
        if (file == null || file.isEmpty()) {
            return null;
        }

        try {
            // Benzersiz dosya adı oluştur: timestamp_uuid_orijinalAd
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
            String uuid = UUID.randomUUID().toString().substring(0, 8);
            String originalFileName = file.getOriginalFilename();
            String extension = "";

            if (originalFileName != null && originalFileName.contains(".")) {
                extension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }

            String fileName = timestamp + "_" + uuid + extension;

            // Dizin yolunu oluştur: uploads/collections/ veya uploads/products/
            Path uploadPath = Paths.get(baseDir, subDirectory);
            Files.createDirectories(uploadPath);

            // Dosyayı kaydet
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath);

            // Erişim URL'ini döndür
            return baseUrl + "/uploads/" + subDirectory + "/" + fileName;

        } catch (IOException e) {
            throw new RuntimeException("Dosya kaydedilemedi: " + e.getMessage(), e);
        }
    }

    /**
     * Dosyayı siler
     */
    public void deleteFile(String fileUrl) {
        if (fileUrl == null || fileUrl.isEmpty()) {
            return;
        }

        try {
            // URL'den dosya yolunu çıkar: /uploads/collections/dosya.jpg
            String relativePath = fileUrl.replace(baseUrl, "");
            Path filePath = Paths.get(relativePath.startsWith("/") ? relativePath.substring(1) : relativePath);
            Path fullPath = Paths.get(filePath.toString());

            Files.deleteIfExists(fullPath);
        } catch (IOException e) {
            // Log at ama devam et (silinemeyen dosya için uygulama çökmesin)
            System.err.println("Dosya silinemedi: " + fileUrl + " - " + e.getMessage());
        }
    }
}