package kr.or.connect.reservation.service.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import kr.or.connect.reservation.dao.CommentDao;
import kr.or.connect.reservation.dao.CommentImageDao;
import kr.or.connect.reservation.dao.FileInfoDao;
import kr.or.connect.reservation.dto.Comment;
import kr.or.connect.reservation.dto.CommentImage;
import kr.or.connect.reservation.dto.FileInfo;
import kr.or.connect.reservation.dto.param.CommentParam;
import kr.or.connect.reservation.dto.response.CommentResponse;
import kr.or.connect.reservation.service.CommentService;
import kr.or.connect.reservation.util.DateUtil;
import kr.or.connect.reservation.util.FileUtil;

@Service
public class CommentServiceImpl implements CommentService {
  @Autowired
  private CommentDao commentDao;

  @Autowired
  private CommentImageDao commentImageDao;

  @Autowired
  private FileInfoDao fileInfoDao;

  @Override
  @Transactional(readOnly = true)
  public List<Comment> getCommentsByDisplayInfoId(int displayInfoId) {
    return commentDao.selectByDisplayInfoId(displayInfoId);
  }

  @Override
  @Transactional(readOnly = true)
  public double getAveScoreByDisplayInfoId(int displayInfoId) {
    return commentDao.selectAvgScoreByDisplayInfoId(displayInfoId);
  }

  @Override
  @Transactional(readOnly = true)
  public List<CommentImage> getCommentImages(int displayInfoId, int commentId) {
    return commentImageDao.selectByDisplayInfoId(displayInfoId, commentId);
  }

  @Override
  @Transactional(readOnly = true)
  public FileInfo getFileInfoByCommentImageId(int commentImageId) {
    return fileInfoDao.selectByCommentImageId(commentImageId);
  }

  @Override
  @Transactional(readOnly = false)
  public CommentResponse addComment(CommentParam commentParam) {
    int commentId = commentDao.insert(commentParam);

    MultipartFile file = commentParam.getAttachedImage();
    if (file != null) {
      String saveFileName =
          FileUtil.upload(file, FileUtil.ROOT_DIR_FOR_WINDOW, FileUtil.REVIEW_IMG_FILE_PATH);

      FileInfo fileInfo = FileInfo.builder().fileName(file.getOriginalFilename())
          .saveFileName(saveFileName).contentType(file.getContentType()).deleteFlag(false)
          .createDate(DateUtil.getNowDate()).modifyDate(DateUtil.getNowDate()).build();

      int fileInfoId = fileInfoDao.insert(fileInfo);

      int commentImgId =
          commentImageDao.insert(commentParam.getReservationInfoId(), commentId, fileInfoId);
    }

    // 랜덤값을 반환받아야하므로 하드 코딩된 의미없는 값을 반환하도록 한다.
    CommentResponse commentResponse = CommentResponse.builder().comment("").commentId(commentId)
        .commentImage(new CommentImage()).createDate(DateUtil.getNowDate())
        .modifyDate(DateUtil.getNowDate()).productId(1).reservationInfoId(1).score(5).build();

    return commentResponse;
  }
}
