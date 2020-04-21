package kr.or.connect.reservation.service;

import java.util.List;
import kr.or.connect.reservation.dto.FileInfo;
import kr.or.connect.reservation.dto.Product;
import kr.or.connect.reservation.dto.ProductImage;
import kr.or.connect.reservation.dto.ProductPrice;

public interface ProductService {
  public static final Integer LIMIT = 4;

  public List<Product> getProductsAll(int start);

  public List<Product> getProductsByCategoryId(int categoryId, int start);

  public int getProductCountAll();

  public int getProductCountByCategoryId(int categoryId);

  List<ProductImage> getImagesByDisplayInfoId(int displayInfoId);

  List<ProductPrice> getPricesByDisplayInfoId(int displayInfoId);

  public FileInfo getProductFileInfoByProductImgId(int productImageId);
}
