package uk.gov.ons.ssdc.responseoperations.model.repository;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import uk.gov.ons.ssdc.common.model.entity.PrintTemplate;

public interface PrintTemplateRepository extends JpaRepository<PrintTemplate, UUID> {}
