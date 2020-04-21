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
public class DisplayInfo {
  @NonNull
  private int categoryId;

  @NonNull
  private String categoryName;

  @NonNull
  private String createDate;

  @NonNull
  private int displayInfoId;

  @NonNull
  private String email;

  @NonNull
  private String homepage;

  @NonNull
  private String modifyDate;

  @NonNull
  private String openingHours;

  @NonNull
  private String placeLot;

  @NonNull
  private String placeName;

  @NonNull
  private String placeStreet;

  @NonNull
  private String productContent;

  @NonNull
  private String productDescription;

  @NonNull
  private String productEvent;

  @NonNull
  private int productId;

  @NonNull
  private String telephone;
}
