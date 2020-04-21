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
public class Promotion {
  @NonNull
  private int id;

  @NonNull
  private int productId;

  @NonNull
  private String productImageUrl;

  @NonNull
  private int productImageId;
}
