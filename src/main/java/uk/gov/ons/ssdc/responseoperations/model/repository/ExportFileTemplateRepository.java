package uk.gov.ons.ssdc.responseoperations.model.repository;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import uk.gov.ons.ssdc.common.model.entity.ExportFileTemplate;

public interface ExportFileTemplateRepository extends JpaRepository<ExportFileTemplate, UUID> {}
