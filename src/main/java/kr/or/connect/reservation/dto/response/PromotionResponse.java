package kr.or.connect.reservation.dto.response;

import java.util.List;
import kr.or.connect.reservation.dto.Promotion;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PromotionResponse {
  @NonNull
  List<Promotion> items;
}
