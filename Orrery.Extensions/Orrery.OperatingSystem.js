/*************************************************************************************************************/

/**
 ** File: Orrery.OperatingSystem.js
 ** Date Written: January 24, 2012
 ** Written By: Timothy "Popisfizzy" Reilly
 **/

/**
 ** Purpose.
 **   This file implements several methods that attempt to query the user's operating system based on their
 ** userAgent header. The file includes a large number of default methods that attempt to detect a large range
 ** of operating systems, and more can be implemented by the programmer, on the fly.
 **/

/*
 * Class definition.
 */

Orrery.OperatingSystem = {

  /*
   * Read-only accessors.
   */

  get UserAgentHeader() { return navigator.userAgent; },

  /*
   * List of supported operating systems.
   */

  SupportedOperatingSystems : {
    'Windows3_1' : 'Windows 3.1', // Windows 3.1
    'Windows95' : 'Windows 95', // Windows NT 4.0, Windows 95
    'Windows98' : 'Windows 98', // Windows NT 4.1, Windows 98
    'WindowsMe' : 'Windows Me', // Windows NT 4.9
    'Windows2000' : 'Windows 2000', // Windows NT 5.0
    'WindowsXP' : 'Windows XP', // Windows NT 5.1, Windows XP
    'WindowsServer2003' : 'Windows Server 2003', // Windows NT 5.2
    'WindowsVista' : 'Windows Vista', // Windows NT 6.0
    'Windows7' : 'Windows 7', // Windows NT 6.1
    'Windows8' : 'Windows 8', // Windows NT 6.2
    
    'WindowsNT' : 'Windows NT', // Windows NT 9.0
    
    'OSX' : 'Mac OS X', //Mac OS X
    'iOS' : 'iOS', // iPhone OS, 'OS (\d_\d(_\d)?) like Mac OS X' (check against OS X).
    
    'Android' : 'Android', // Android (check against Windows).
    
    'Linux' : 'Linux', // Linux
    
    'FreeBSD' : 'FreeBSD', // FreeBSD
    'OpenBSD' : 'OpenBSD', // OpenBSD
    'NetBSD' : 'NetBSD', // NetBSD
    },

};