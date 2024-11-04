package com.backend.controller;

import com.backend.model.LicenseKey;
import com.backend.repository.LicenseKeyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/license")
public class LicenseController {

    @Autowired
    private LicenseKeyRepository licenseKeyRepository;

    @PostMapping("/validate")
    public ResponseEntity<?> validateKey(@RequestBody LicenseKey license) {
        // Check if the provided license key exists in the database and is active
        boolean isValid = licenseKeyRepository.existsByLicenseKeyAndIsActiveTrue(license.getLicenseKey());
        
        // Return a response with a Map containing "valid": true/false
        return ResponseEntity.ok().body(Map.of("valid", isValid));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerKey(@RequestBody LicenseKey license) {
        if (licenseKeyRepository.count() > 0) {
            return ResponseEntity.badRequest().body(Map.of("message", "License key already registered"));
        }
        license.setActive(true);
        licenseKeyRepository.save(license);
        return ResponseEntity.ok().body(Map.of("message", "License key registered successfully"));
    }

    @GetMapping("/check")
    public ResponseEntity<?> checkIfKeyExists() {
        boolean exists = licenseKeyRepository.count() > 0;
        return ResponseEntity.ok().body(Map.of("exists", exists));
    }
} 