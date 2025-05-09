package org.dw.springbootcrud.repository;


import jakarta.transaction.Transactional;
import org.dw.springbootcrud.domain.Board;
import org.dw.springbootcrud.domain.UploadFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UploadFileRepository extends JpaRepository<UploadFile, Long> {
    public List<UploadFile> findByBoardOrderByFileOrderAsc(Board board);


    @Modifying
    @Transactional
    @Query("UPDATE UploadFile f SET f.fileOrder = :fileOrder WHERE f.savedName = :savedName")
    void updateFileOrderBySavedName(@Param("savedName") String savedName, @Param("fileOrder") Integer fileOrder);

    void deleteBySavedName(String savedName);
}
