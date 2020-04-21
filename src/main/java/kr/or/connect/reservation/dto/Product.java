package kr.or.connect.reservation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Product {
  @NonNull
  private int displayInfoId;

  @NonNull
  private String placeName;

  @NonNull
  private String productContent;

  @NonNull
  private String productDescription;

  @NonNull
  private int productId;

  @NonNull
  private String productImageUrl;

  @NonNull
  int productImageId;
}
