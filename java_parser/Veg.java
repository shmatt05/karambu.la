package matan.veg;

import matan.veg.ConnectSQL;


public class Veg {
	public static ConnectSQL dbCon = new ConnectSQL();
	public static void main(String[] args) throws Exception {
	   
	    dbCon.connectToDB();
	    dbCon.insertPrices("http://147.237.72.176/prices/veg.xlsx", true,false);
	    dbCon.insertPrices("http://147.237.72.176/prices/fruit.xlsx", false,false);
	    dbCon.insertPrices("http://147.237.72.176/prices/citr.xlsx", false,true);
	    dbCon.disconnectFromDB();
	  }
	
	
}
