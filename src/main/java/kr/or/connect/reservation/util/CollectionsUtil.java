package kr.or.connect.reservation.util;

import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.Map;

public class CollectionsUtil {

	public static Map<String, Object> convertObjectToMap(Object obj){
		Map<String, Object> map = new HashMap<>();
		
		try {
			Field[] fields = obj.getClass().getDeclaredFields();
			for(Field field : fields) {
				field.setAccessible(true);
				map.put(field.getName(), field.get(obj)); 
			}
		}catch (IllegalArgumentException e) {
			e.printStackTrace();
			map = null;
		}catch (IllegalAccessException  e) {
			e.printStackTrace();
			map = null;
		}catch (Exception e) {
			e.printStackTrace();
			map = null;
		}
		
		return map;
	}
}
