package kr.or.connect.reservation.test;

import java.lang.invoke.SwitchPoint;
import java.util.Collections;

import kr.or.connect.reservation.type.ImageType;

public class Main {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		String type = "th";

		System.out.println(ImageType.valueOfImageTypeName(type).getImageTypeName());
	}

}
