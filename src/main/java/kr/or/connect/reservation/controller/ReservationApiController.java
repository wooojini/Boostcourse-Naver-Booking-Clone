package kr.or.connect.reservation.controller;

import java.util.List;
import java.util.Map;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import kr.or.connect.reservation.dto.Category;
import kr.or.connect.reservation.dto.Comment;
import kr.or.connect.reservation.dto.DisplayInfo;
import kr.or.connect.reservation.dto.DisplayInfoImage;
import kr.or.connect.reservation.dto.Product;
import kr.or.connect.reservation.dto.ProductImage;
import kr.or.connect.reservation.dto.ProductPrice;
import kr.or.connect.reservation.dto.Promotion;
import kr.or.connect.reservation.dto.ReservationInfo;
import kr.or.connect.reservation.dto.param.CommentParam;
import kr.or.connect.reservation.dto.param.ReservationParam;
import kr.or.connect.reservation.dto.response.CategoryResponse;
import kr.or.connect.reservation.dto.response.CommentResponse;
import kr.or.connect.reservation.dto.response.DisplayInfoResponse;
import kr.or.connect.reservation.dto.response.ProductResponse;
import kr.or.connect.reservation.dto.response.PromotionResponse;
import kr.or.connect.reservation.dto.response.ReservationInfoResponse;
import kr.or.connect.reservation.dto.response.ReservationResponse;
import kr.or.connect.reservation.exception.CategoryNotFoundException;
import kr.or.connect.reservation.exception.DisplayInfoImageNotFoundException;
import kr.or.connect.reservation.exception.DisplayInfoNotFoundException;
import kr.or.connect.reservation.exception.ProductNotFoundException;
import kr.or.connect.reservation.exception.PromotionNotFoundException;
import kr.or.connect.reservation.exception.ReservationInfoNotFoundException;
import kr.or.connect.reservation.service.CategoryService;
import kr.or.connect.reservation.service.CommentService;
import kr.or.connect.reservation.service.DisplayInfoService;
import kr.or.connect.reservation.service.ProductService;
import kr.or.connect.reservation.service.PromotionService;
import kr.or.connect.reservation.service.ReservationService;
import kr.or.connect.reservation.type.CategoryType;
import kr.or.connect.reservation.util.CollectionsUtil;
import kr.or.connect.reservation.util.DateUtil;

@RestController
@RequestMapping(path = "/api")
public class ReservationApiController {
  @Autowired
  PromotionService promotionService;

  @Autowired
  CategoryService categoryService;

  @Autowired
  ProductService productService;

  @Autowired
  DisplayInfoService displayInfoService;

  @Autowired
  CommentService commentService;

  @Autowired
  ReservationService reservationService;

  @CrossOrigin
  @GetMapping("/promotions")
  public Map<String, Object> getPromotions() {
    List<Promotion> promotions = promotionService.getPromotions();

    if (promotions.isEmpty()) {
      throw new PromotionNotFoundException();
    }

    PromotionResponse promotionResponse = PromotionResponse.builder().items(promotions).build();

    return CollectionsUtil.convertObjectToMap(promotionResponse);
  }

  @CrossOrigin
  @GetMapping("/categories")
  public Map<String, Object> getCategories() {
    List<Category> categories = categoryService.getCategories();

    if (categories.isEmpty()) {
      throw new CategoryNotFoundException();
    }

    CategoryResponse categoryResponse = CategoryResponse.builder().items(categories).build();

    return CollectionsUtil.convertObjectToMap(categoryResponse);
  }

  @CrossOrigin
  @GetMapping("/products")
  public Map<String, Object> getProducts(
      @RequestParam(name = "categoryId", required = false, defaultValue = "0") int categoryId,
      @RequestParam(name = "start", required = false, defaultValue = "0") int start) {

    List<Product> products;
    int totalCount;

    if (CategoryType.ALL.getCategoryId() == categoryId) {
      products = productService.getProductsAll(start);

      if (products.isEmpty()) {
        throw new ProductNotFoundException();
      }

      totalCount = productService.getProductCountAll();
    } else {
      products = productService.getProductsByCategoryId(categoryId, start);

      if (products.isEmpty()) {
        throw new ProductNotFoundException();
      }

      totalCount = productService.getProductCountByCategoryId(categoryId);
    }

    ProductResponse productResponse =
        ProductResponse.builder().items(products).totalCount(totalCount).build();

    return CollectionsUtil.convertObjectToMap(productResponse);
  }


  @GetMapping("/products/{displayInfoId}")
  @CrossOrigin
  public Map<String, Object> getProducts(@PathVariable(name = "displayInfoId") int displayInfoId) {

    DisplayInfo displayInfo = displayInfoService.getDisplayInfoById(displayInfoId);
    DisplayInfoImage displayInfoImage = displayInfoService.getImagesByDisplayInfoId(displayInfoId);
    List<Comment> comments = commentService.getCommentsByDisplayInfoId(displayInfoId);
    List<ProductImage> productImages = productService.getImagesByDisplayInfoId(displayInfoId);
    List<ProductPrice> productPrices = productService.getPricesByDisplayInfoId(displayInfoId);

    if (displayInfo == null) {
      throw new DisplayInfoNotFoundException();
    }

    if (displayInfoImage == null) {
      throw new DisplayInfoImageNotFoundException();
    }

    if (!comments.isEmpty()) {
      for (Comment comment : comments) {
        int commentId = comment.getCommentId();
        comment.setCommentImages(commentService.getCommentImages(displayInfoId, commentId));
      }
    }

    double averageScore = commentService.getAveScoreByDisplayInfoId(displayInfoId);
    String reservationDate = reservationService.getRandomReservationDate();

    DisplayInfoResponse displayInfoResponse =
        DisplayInfoResponse.builder().displayInfo(displayInfo).displayInfoImage(displayInfoImage)
            .productImages(productImages).productPrices(productPrices).comments(comments)
            .averageScore(averageScore).reservationDate(reservationDate).build();

    return CollectionsUtil.convertObjectToMap(displayInfoResponse);
  }

  @CrossOrigin
  @GetMapping("/reservations")
  public Map<String, Object> getReservations(@RequestParam(name = "reservationEmail",
      required = true, defaultValue = "") String reservationEmail) {

    List<ReservationInfo> reservationInfos =
        reservationService.getReservationInfoByEmail(reservationEmail);
    if (reservationInfos.isEmpty()) {
      throw new ReservationInfoNotFoundException();
    }

    for (ReservationInfo reservationInfo : reservationInfos) {
      int displayInfoId = reservationInfo.getDisplayInfoId();
      int productId = reservationInfo.getProductId();
      String reservationDate = reservationInfo.getReservationDate();

      DisplayInfo displayInfo = displayInfoService.getDisplayInfoById(displayInfoId);
      if (displayInfo == null) {
        throw new DisplayInfoNotFoundException();
      }
      reservationInfo.setDisplayInfo(displayInfo);

      int totalPrice = reservationService.getTotalPrice(reservationEmail, productId, displayInfoId,
          reservationDate);
      reservationInfo.setTotalPrice(totalPrice);
    }

    ReservationInfoResponse reservationInfoResponse = ReservationInfoResponse.builder()
        .reservations(reservationInfos).size(reservationInfos.size()).build();

    return CollectionsUtil.convertObjectToMap(reservationInfoResponse);
  }

  @CrossOrigin
  @PutMapping(path = "/reservations/{reservationId}")
  public Map<String, Object> putReservations(
      @PathVariable(name = "reservationId") int reservationId) {

    boolean cancelFlag = true;
    String modifyDate = DateUtil.getNowDate();
    ReservationResponse reservationResponse =
        reservationService.changeCancelFlagById(reservationId, cancelFlag, modifyDate);

    return CollectionsUtil.convertObjectToMap(reservationResponse);
  }

  @CrossOrigin
  @PostMapping(path = "/reservations")
  public Map<String, Object> postReservations(
      @RequestBody(required = true) @Valid ReservationParam reservationParam) {

    ReservationResponse reservationResponse = reservationService.addReservation(reservationParam);

    return CollectionsUtil.convertObjectToMap(reservationResponse);
  }

  @CrossOrigin
  @PostMapping(path = "/reservations/{reservationInfoId}/comments")
  public Map<String, Object> postComments(@ModelAttribute @Valid CommentParam commentParam) {
    System.out.println(commentParam.toString());

    CommentResponse commentResponse = commentService.addComment(commentParam);

    return CollectionsUtil.convertObjectToMap(commentResponse);
  }

}
