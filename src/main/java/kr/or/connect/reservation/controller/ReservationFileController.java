package kr.or.connect.reservation.controller;

import javax.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import kr.or.connect.reservation.dto.FileInfo;
import kr.or.connect.reservation.exception.FileInfoNotFoundException;
import kr.or.connect.reservation.service.CommentService;
import kr.or.connect.reservation.service.DisplayInfoService;
import kr.or.connect.reservation.service.ProductService;
import kr.or.connect.reservation.service.PromotionService;
import kr.or.connect.reservation.util.FileUtil;

@Controller
@RequestMapping(path = "/download")
public class ReservationFileController {
  @Autowired
  PromotionService promotionService;

  @Autowired
  ProductService productService;

  @Autowired
  DisplayInfoService displayInfoService;

  @Autowired
  CommentService commentService;

  @CrossOrigin
  @GetMapping(path = "/promotions/{productImageId}")
  public void getPromotionImage(@PathVariable(name = "productImageId") int productImageId,
      HttpServletResponse response) {

    FileInfo fileInfo = promotionService.getPromotionFileInfo(productImageId);
    if (fileInfo == null) {
      throw new FileInfoNotFoundException();
    }

    boolean didDownload = FileUtil.download(fileInfo, response);
    if (!didDownload) {
      // 파일 다운로드가 실패 했을 시에 에러 처리에 대해 궁금합니다!
    }
  }

  @CrossOrigin
  @GetMapping(path = "/products/{productImageId}")
  public void getProductImage(@PathVariable(name = "productImageId") int productImageId,
      HttpServletResponse response) {

    FileInfo fileInfo = productService.getProductFileInfoByProductImgId(productImageId);

    if (fileInfo == null) {
      throw new FileInfoNotFoundException();
    }

    boolean didDownload = FileUtil.download(fileInfo, response);
    if (!didDownload) {

    }
  }

  @CrossOrigin
  @GetMapping(path = "/displays/{displayInfoImageId}")
  public void getDisplayInfoImage(@PathVariable(name = "displayInfoImageId") int displayInfoImageId,
      HttpServletResponse response) {

    FileInfo fileInfo = displayInfoService.getFileInfoByDisplayInfoImageId(displayInfoImageId);

    if (fileInfo == null) {
      throw new FileInfoNotFoundException();
    }

    boolean didDownload = FileUtil.download(fileInfo, response);
    if (!didDownload) {

    }
  }

  @CrossOrigin
  @GetMapping(path = "/comments/{commentImageId}")
  public void getCommentImage(@PathVariable(name = "commentImageId") int commentImageId,
      HttpServletResponse response) {

    FileInfo fileInfo = commentService.getFileInfoByCommentImageId(commentImageId);

    if (fileInfo == null) {
      throw new FileInfoNotFoundException();
    }

    boolean didDownload = FileUtil.download(fileInfo, response);
    if (!didDownload) {

    }
  }
}
