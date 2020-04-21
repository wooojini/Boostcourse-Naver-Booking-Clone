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
public class ReservationInfo {
  @NonNull
  private String reservationName;

  @NonNull
  private String reservationEmail;

  @NonNull
  private String reservationTelephone;

  @NonNull
  private String reservationDate;

  @NonNull
  private int productId;

  @NonNull
  @Builder.Default
  private int totalPrice = 0;

  @NonNull
  private int displayInfoId;

  private int reservationInfoId;

  @NonNull
  @Builder.Default
  private boolean cancelYn = false;

  @NonNull
  private String createDate;

  @NonNull
  private String modifyDate;

  private DisplayInfo displayInfo;
}
