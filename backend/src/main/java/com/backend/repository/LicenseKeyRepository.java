package com.backend.repository;

import com.backend.model.LicenseKey;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LicenseKeyRepository extends JpaRepository<LicenseKey, String> {
    boolean existsByLicenseKeyAndIsActiveTrue(String licenseKey);
} 