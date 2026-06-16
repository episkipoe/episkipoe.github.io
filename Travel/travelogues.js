const DOCS = [
  ["2025/08 - DEF CON 33 / DaveCon 4.2", "https://docs.google.com/document/d/1AzK0nzqCdaiZECCq4kKoY3V3NjuLak1vkBxOy_BbJ88", "conference"],
  ["2018/08 - DEF CON 26", "https://docs.google.com/document/d/12PIGvfpD192hh8Jk465M2pY4-vRkonKlGN7iKJwzOf4", "conference"],
  ["2012 - DEF CON 20", "https://docs.google.com/document/d/1xm1-fDl5kvDHaZJSvPMrH5-DdyIfNph05D_turKDFqE", "conference"],
  ["2013 - DEF CON 21", "https://docs.google.com/document/d/1lIG_3fjEeHrEgRAs0KIli-ShOhB_d4rfFclYjwonDm4", "conference"],
  ["2015 - DEF CON 23: Return of the Lid", "https://docs.google.com/document/d/1vFZRwV2hmBbPV3DAAsq99GrsD0PoLFlQJFjtMZvDqPc", "conference"],
  ["2017/08 - DEF CON 25: The AnniversAg", "https://docs.google.com/document/d/1AxKBsyXtjZXLuT6bWRWyJjXGIC21ReDdvXnlxG_t_X4", "conference"],
  ["2024 - DEF CON 32 / DaveCon 3.14", "https://docs.google.com/document/d/1oaGeMpaKX69vDvRT8u-n9noyw66Tj9VWQcM_10Sb85A", "conference"],
  ["2014 - DEF CON 22: Making friends with lobsters", "https://docs.google.com/document/d/1O_oirBjVROHf_h7YoDuoh1A-52Ht_u4j-lF0ztQhUyQ", "conference"],
  ["2014 - PhreakNIC 18", "https://docs.google.com/document/d/1B-Rwu8bwxVaGC2mLQfNuM_6fkNlQm2BV6BDi63rH7yE", "conference"],
  ["2011 - PhreakNIC 15", "https://docs.google.com/document/d/1bKdLK1Ox57am6u1aJ5ksn5ehjhJd2z2k9FL3ADNx77s", "conference"],
  ["2019/08 - DEF CON 27: Getting Stones and Bumping Badges", "https://docs.google.com/document/d/1mlK7W0QJOLGrEEgJ3pC8fKKJj2KAhhK4WS1RoehJ7QU", "conference"],
  ["2011 - DEF CON 19", "https://docs.google.com/document/d/1FnRgWiPpgty_qNhtdrVAuiiAoOBAmU9gHmpzxh9crGc", "conference"],
  ["2016/08 - DEF CON 24: Rise of the Machines", "https://docs.google.com/document/d/1DAkBf0XbJD6Cn0WmnmiNOQaEMraJr8yKJvlLTO4IZds", "conference"],
  ["2010 - DEF CON 18", "https://docs.google.com/document/d/1lnrpU3XsP6V8EE6yCodgKpJql-umXaFWto8U5Kn2IxQ", "conference"],
  ["2009 - DEF CON 17", "https://docs.google.com/document/d/17fU6gzN_swk2ydoSpzNF_yLklJif3GzDx2M1yuEr2d0", "conference"],
  ["2006 - DEF CON 14", "https://docs.google.com/document/d/1CYHrL5f7RB9Euj-vb7fVBVvJgf86Mzr54suTziqo9GM", "conference"],
  ["2008 - DEF CON 16", "https://docs.google.com/document/d/1pYhBdotWzTOMQp_YS9KdlVfRFJXvfoiTrWFg4SmEV8s", "conference"],
  ["2023 - DEF CON 31 / DaveCon 2.1", "https://docs.google.com/document/d/19L7Xp_Kvz2vSCQtCk9RlQ3hHlzpowm8FXnbNuoqx-NI", "conference"],
  ["2021/08 - DEF CON 29 - DaveCon 0x0", "https://docs.google.com/document/d/1GsItmplrJTlb02CClvNM4Jv8sW6bOXMFimozth7cOLA", "conference"],
  ["2022 - DEF CON 30 - DaveCon 1.0", "https://docs.google.com/document/d/10pknMyp7eMQa5K1S5WkilPujUupOhHGwtNkq9URTMqg", "conference"],
  ["2023 - PhreakNIC 24", "https://docs.google.com/document/d/1n4aDrIvLtfdLTO3mX3DbZxsHTg_jl_SsO1NS2ok_07Q", "conference"],
  ["2019 - PhreakNIC 23", "https://docs.google.com/document/d/106jlMEOBMe5Ur9Xbs4E2sjdzuj7xk-d5eHr1mdPlaWQ", "conference"],
  ["2007 - DEF CON 15", "https://docs.google.com/document/d/1jC6n4SAwQXHDq6dSu5t0yJ1jPqWpleWAbqNKE2SywrQ", "conference"],
  ["2015 - PhreakNIC 19", "https://docs.google.com/document/d/1zy-Uvej-8COZghY12MCJNjM2u1yWiw-5v9oa0P-MqxU", "conference"],
  ["2020/08 - DEF CON 28 Safe Mode", "https://docs.google.com/document/d/1CfiZTiDRKkitCcn2fAEY-ePoVzDuG9vs9opz6Ibl1yk", "conference"],
  ["2017/11 - PhreakNIC 21", "https://docs.google.com/document/d/1u5cB3B2XRlHFA4XvcA-hct4HygRYHlVn3KTaicz3zYY", "conference"],
  ["2016/11 PhreakNIC 20: Back to our Rootz", "https://docs.google.com/document/d/1qHXyH5gyNIv1-71-jffIEfbwdLf5XWCaIs0CgZc2AC0", "conference"],
  ["2012 - DEF CON 20 - Standard Deviation", "https://docs.google.com/document/d/1ELgZdozx8MwLLiK80hU7W_YfbKJjVKFLmYbeqdY6Xqs", "conference"],
  ["2025/05 - Ireland", "https://docs.google.com/document/d/1vVhKHt2qFiT5eTNKGnCFyfHI88Y1cNzVCsY97ObQViw", "travel"],
  ["2021/08 - Boston - Selfies of the mind", "https://docs.google.com/document/d/13sjSz0XL00zFcdOM1g72VNLIWlVCTODXDlnf3oHUrCA", "travel"],
  ["2013 - Istanbul", "https://docs.google.com/document/d/18OclSkrL9dyQLLdhktFuiv3ura_nuFQ7bYBpDlk859A", "travel"],
  ["2025/05 - Ireland Appendices", "https://docs.google.com/document/d/1S8z1t-tpEhLl4f9rh7a_HmP6OBvf5OEfCqZqcGqBCQY", "travel"],
  ["2024/05 - Ryan & Victoria's wedding", "https://docs.google.com/document/d/1d0Jxf9SOLQuGQaq9ALTt4xIU5RAb8XDl4LInyd9efKg", "travel"],
  ["2013 - Steve and Dave Visit Texas", "https://docs.google.com/document/d/1NDVrfF4XGIkodLPNnaCVikIgZ9JcVhDCCtq4dcH8otg", "travel"],
  ["2021/10 - Galapagos", "https://docs.google.com/document/d/1X4RmklfInG99A7GGSeGaDdjMoSn0VuUk0B9BxCWyZ98", "travel"],
  ["1997 - Germany", "https://docs.google.com/document/d/1cjkSWbCci1ZpMj6jyD8nKalIylrz6gG1SaqOtq0RV1k", "travel"],
  ["2013 - Greece", "https://docs.google.com/document/d/1cuTP8aSZTUkatwoh7YzQEf08XbT0gsCo3LcDZlK0gHA", "travel"],
  ["2012 - Scotland", "https://docs.google.com/document/d/12Qf72l5PWfBahc0gdWe9cKYve5-57Iu8SFacC0EwQRo", "travel"],
  ["2012", "https://docs.google.com/document/d/1tcUkTP6YMKQ0jQGdynVT_KPNxTnle2fp_dPL9Vad-7E", "travel", 2012],
  ["2025/04 - Memphis", "https://docs.google.com/document/d/1skHai4oLNPFem4SnbGolsKVGtbKT_UbMpAih_yYSEkg", "travel"],
  ["2008 - Memphis", "https://docs.google.com/document/d/1e0PjA-RbBlKdVhm4LRjsPbGsm9RYp6y0PiBooKio4kg", "travel"],
  ["2017/10 - T3: Revenge of the Burrito", "https://docs.google.com/document/d/13S5TjDt6xtOqgNip_biukmZuijpNwsc65m7iGHad39c", "travel"],
  ["2024/05 - Cicada invasion", "https://docs.google.com/document/d/1mraUmgwkaw5KDaxHfkyN6SVCgrd00FTkc0S98ZXgkFc", "travel"],
  ["Oneliners", "https://docs.google.com/document/d/1rdJhkMOqJaGO1N0vJUqW2TIwYP7CeSAdq8lV_IMNLuQ", "travel", 2024],
  ["2020 - Thanksgiving + Escape room", "https://docs.google.com/document/d/1rWkLYKS96umcoHwrjQs-a8kOQe1ZlwSwm0mOpI3RCMQ", "travel"],
  ["2023/11 - Thanksgiving + James' Wedding", "https://docs.google.com/document/d/1OBFepijX41TTCiSF9V1sX5In4ma8VcUa0U_UCA7K5nY", "travel"],
  ["2013 / 06 - Electriquarium", "https://docs.google.com/document/d/1_qEU4gtFNQUfPHDnJOQ3DGKGLzRdXOqtg9bf9N8gDkY", "travel"],
  ["2000 - Tempel of Steel", "https://docs.google.com/document/d/1wxeA8De9OtZFd1H_HMOnKPgkla1m4qRkn4_AwSoCsSo", "travel"],
  ["2005 - Cancer", "https://docs.google.com/document/d/1lIRRap2frGKFg3bvyVDIx-brbxuW0PCNybU2P4XmQ04", "travel"],
  ["2023/05 - Mother's Day", "https://docs.google.com/document/d/1QkxrygEIKiKgjDPWKwCADUaQb0iJjPmPXA2SyExEPCg", "travel"],
  ["2015 - Turks and Caicos", "https://docs.google.com/document/d/1kghkFBLxVVCuKSc0Ck0tvygGqlaFvqLy4o8A8ILjFwY", "travel"],
  ["2019 - Archon 42", "https://docs.google.com/document/d/1B9W7EwIWkPEWulOUnRoA2cE7WutVT7g7jHaGyIWe_no", "travel"],
  ["2021/09 - Labor Day", "https://docs.google.com/document/d/1tpeOhgJhyddFp-lxki9Op5mFXrcMBhbwPfzEXzeCG30", "travel"],
  ["2009 - Summer", "https://docs.google.com/document/d/1DTStvz931HV65RvQUsORH9EDSgJnuXzMubdsWFNOtdE", "travel"],
  ["2013 / 07 - Walla-Pa-Looza", "https://docs.google.com/document/d/18GeamUQ1ukLwtyaoDJ4AYk9l2UtJS9AEVzWCekvKELM", "travel"],
  ["COVID19", "https://docs.google.com/document/d/1TyfPabLDXlik9_AbnzrNTms5mRDqfCJsUzxfG7TKU8I", "travel", 2020],
  ["2019/02 - Florida Keys", "https://docs.google.com/document/d/1rNt6u9O-J9AjV82L6ossZcX08pmsZmbLgcJaBMa9U58", "travel"],
  ["2012 - Reynolds", "https://docs.google.com/document/d/1-l95LYqhmyVSnlYjYNtGU3cYHtvDsBVjdyFQi_nwq1U", "travel"],
  ["2006 - Offroading", "https://docs.google.com/document/d/1pg1J8zTIvs5KZqRAV69pKG5TOCTfAMP9joQS_oSHh7U", "travel"],
  ["2013 / 05 - Memorial Day", "https://docs.google.com/document/d/1SXil6JcKf6G-WYPyiJ2dj4t1fUpz0iFQC_xK3PBGIFw", "travel"],
  ["1998 - Texas", "https://docs.google.com/document/d/1Cb-86RzcI4LDx_jwzpYNsbmj_CqWwCv06_YR5lIeXMY", "travel"],
  ["1996 - Georgia", "https://docs.google.com/document/d/1hHh_WnStfMYlouuykcZe5eHVQ3V-jTnDnUqUDCfjDG4", "travel"],
  ["Family Heirlooms", "https://docs.google.com/document/d/1T-4C7p81y87-zH8R7S70On5RSLEVPrzybGVKNekTWbA", "travel", 2019],
  ["1999 - France", "https://docs.google.com/document/d/1ovNLlb7xGZQo6IgGw0h8XWPjE-DR5IWBjD4ZWBpWtbw", "travel"],
  ["2002 - Tim's Wedding", "https://docs.google.com/document/d/1gZP6lXuYYoSHxY1PVkIJw6vu5qsFYTina4DzxlrtDXM", "travel"],
  ["2005 - Africa", "https://docs.google.com/document/d/1ArKDvI_io6TUURKcUhhqxrOiesMSDecbo3KN3EPYrpY", "travel"],
  ["2004 - Mom's Graduation", "https://docs.google.com/document/d/18lBwl8zq7wput8sbf2Ujm4P6zXHJpGqtgVlkUArrEf8", "travel"],
  ["2003 - Cuba", "https://docs.google.com/document/d/19pfNHqf1jxHFEq0t8FQGQCiIZtd3XD66kdyIVQgo8p0", "travel"],
  ["2003 - Knox", "https://docs.google.com/document/d/1OYRMTkSAn5I3QV6XBh0xBxmqSoetSbp4t-tqeJYYDJg", "travel"],
  ["2002 - Wyoming", "https://docs.google.com/document/d/122Or_-0jT9VDzAK_VqJhB1c9xZD1-mLE1xxCK-dfYzo", "travel"],
  ["2007 - Seattle", "https://docs.google.com/document/d/1GVBeIBC0rDpyI0ukNzlH3L-DsXWq1L4CeEzyCCd7rY8", "travel"],
  ["2013 - Dave Bennett", "https://docs.google.com/document/d/1-ZlddYU_lrs3UbhRqF2gdm99qK3VWX2pndev_-c20U4", "travel"],
  ["JRR", "https://docs.google.com/document/d/1lB5l_7XJH0kAUJT876ScIrmPa51ZzHmtVvo9MVvEXC0", "travel", 2019],
  ["2012 - Peoria", "https://docs.google.com/document/d/1x9VoLvB45Ar1_u2J5pgU3Evzxy62v06zLqaax7viUx8", "travel"],
  ["2019/03 - St. Patrick's Day", "https://docs.google.com/document/d/1MKB5DdjYyzI2zSho82HC7TWXvKCo7uobt3RVPhw9lNo", "travel"],
  ["2017/01 - Florida Keys", "https://docs.google.com/document/d/1rLWGjqryylwm_nB4xpDvOpwc_brR4rB1S1zLZHg5rJk", "travel"],
  ["2010 - Indiana", "https://docs.google.com/document/d/164GbXNFVk_2bwvyQ0g8k-MdxWD9dN8SrbCT4ZQJiA4I", "travel"],
  ["2016/10 - Archon 40", "https://docs.google.com/document/d/1_jH1BsKypIwovUFN1YcKTpKZorLX3i0rIu6XdchtMXA", "travel"],
  ["2016/08 - Blarney Island VIP", "https://docs.google.com/document/d/16ak7PEISP87fd-Ztwn4V1_J0Tlp-cVhpkM91aVuHfE4", "travel"],
  ["2016/03 - Roatan", "https://docs.google.com/document/d/1WmhUcukT8g8gDuKQsO0qjGoIE4KwTwso4EZlZqA0vNM", "travel"],
  ["2017/11 - Thanksgiving", "https://docs.google.com/document/d/1rjkUT4jKhHYT5V9E0srJNJXxFeE8qn0rIwCnpHJbBX0", "travel"],
  ["2017/09 - StrangeLoop & Archon 41", "https://docs.google.com/document/d/10gdGxRbUASWDNfWMlJhj7MqJTt0zapHvDc6pZyQ40w8", "travel"],
  ["2017/08 - Eclipse", "https://docs.google.com/document/d/1TAzGAn0aXg_f9rptjvbdEFh8JB-RqJX1gdDgtQBTiFQ", "travel"],
  ["2011 - Archon 35", "https://docs.google.com/document/d/1czXnp5EJXRv_DJrr9x6CFZnsm4vHog9LFzPPOTDOJ-c", "travel"],
  ["2012 / 07 - STL JUG", "https://docs.google.com/document/d/1UkR5Oznuh86q0l4vi2dI2C3iK0jOmZbDAdrlZDESEZw", "travel"],
  ["2013 / 06 Urban Chestnut", "https://docs.google.com/document/d/16G5p0XVvFwzHd5C-O07eE3OpYy4VpHbq54mhib_AaVM", "travel"],
  ["2013 / 06 - Brewers Heritage Festival", "https://docs.google.com/document/d/1_FAmMMGQPY86ew4_syWlLfrbtIkAFI5N1uiaLc7eFWY", "travel"],
  ["2013 / 06 - Spamalot", "https://docs.google.com/document/d/1slfViTBEp83eEJm5hg8MiJ6ts0FwW9fX9IgsVG-BC4U", "travel"],
  ["2013 / 09 - Trailhead", "https://docs.google.com/document/d/1mSvEAuKwYR17uBnScje8ehqbAtdipXgzo-Kad52_SyQ", "travel"],
  ["2013 / 09 - Schlafly", "https://docs.google.com/document/d/1aS5ogbDn2LMazJ2niWt3QWFMS-pm9vkYWiM4Q7o3v7U", "travel"],
  ["2014 / 04 - Lemmons", "https://docs.google.com/document/d/1j9BnPGaYVgnkpwXD7uwVlQrprlxadhQwXHCFlm64Urs", "travel"],
  ["2013 / 05 Maifest", "https://docs.google.com/document/d/1Gun65SWDY0w7scybWTtScaxcGUZmlWSC8b1v_Wn9Z9k", "travel"],
  ["2013 / 07/12 - Harry's", "https://docs.google.com/document/d/1MeHHEVHTzQeDmxIXDSES60JFHwqxUC30cSHLIn4wLfA", "travel"],
  ["2013 / 05- Something wicked this May comes", "https://docs.google.com/document/d/1kmL2sDOZTp3hexTftpFNGT02VGYr2qBWu-tzjod_Qlg", "travel"],
  ["2017/07 - Fourth with the Folks", "https://docs.google.com/document/d/1ylUOA2_tiTGYbjX4Hw3jzvPurzdYd1XALYT2UOlfGL8", "travel"],
  ["2017/07 - MST3K", "https://docs.google.com/document/d/1x7oLoEA07_E55ihb1CVT-lwTKSyiXfHmCnfOFyJjPC4", "travel"],
  ["2011 - Archon 35", "https://docs.google.com/document/d/1VWJGmgvpMX72QWUtezeUd-cWwNuKmeM8XQ1c59KUJHw", "travel"],
  ["2015 - Labor Day", "https://docs.google.com/document/d/1gwScManasniEWWwUy5sMx0q3N_gE_OStWRYyAw0TkU0", "travel"],
  ["2012 - Soulard", "https://docs.google.com/document/d/1bZQaLXwOAxxYD5wQh0uKEX9cjXlMY5MSslPv-ey8PVg", "travel"],
  ["2010 - Terri's Wedding", "https://docs.google.com/document/d/1Ft55zt7o6NVLHfU-JVdbZjhqns2UQGOCHW5MIv8Jp9c", "travel"],
  ["2016 - Garden", "https://docs.google.com/document/d/1ygHolERV67pm8W5B9fykJXZrHH490eTC_QH1tnO0yg0", "travel"],
  ["2008 - Mnke Wedding", "https://docs.google.com/document/d/1nqz6sGOWH4OttLTirY5-tVEutpqn8VctRTSVEDbHT1Y", "travel"],
  ["2009 - Columbus", "https://docs.google.com/document/d/1pTEnf75udDQzGpUwjvlVuDJeeWixm-wSX_I1lrnTi2k", "travel"],
  ["2009 - Thanksgiving", "https://docs.google.com/document/d/1U_me-KHk3tEvMfddFQ0b1N_c3AOJZEkqhqO2OEwDYrA", "travel"],
  ["2010 - BB King", "https://docs.google.com/document/d/1Wb32k4bMzB8sCYLTbOebu7HXhZQNTk1l_sHxIFtJMaA", "travel"],
  ["2010 - Penny Arcade", "https://docs.google.com/document/d/1D9t5EY8QIC2-s7aDjggD438kosAfvLaPzo3wv17JZwo", "travel"],
  ["2004", "https://docs.google.com/document/d/1Jkdu5ycLZ2lv2VSm0Hmskoz_lssMLFeAPnSfrGm6YnQ", "travel", 2004],
  ["2003", "https://docs.google.com/document/d/1idzLxWRr03jF1ZrKuVGYulV8UUl6qUb9Yr4hXqcGWH8", "travel", 2003],
  ["2011 - Mardi Gras", "https://docs.google.com/document/d/1Nu_6-5sfSjtoE1qlGIGpJ8NSj7oAzIqMmBIvq8D4vkg", "travel"],
  ["2011 - Presidents Day", "https://docs.google.com/document/d/1UNNNSykQO1ujOCClgF16-n9L3PJuDRoFWuLzceSxQRA", "travel"],
  ["2011 - Columbus Day", "https://docs.google.com/document/d/1dqmCwsHlm4rvg-Zfp-r0tGCctGkSpVs9VodybB7iGAk", "travel"],
  ["2010 - Memorial Day", "https://docs.google.com/document/d/1sEAvhmDvGn89z03xFylBaWb-3sSDHWcOrUPj-SxsNeE", "travel"],
  ["2010 - Columbus", "https://docs.google.com/document/d/1FSCoP7LA-CkgOOJjgvoTqRvwHnUXOlGYCyKJUIP2i6M", "travel"],
  ["2013 - BB's", "https://docs.google.com/document/d/16aNKhF-oSxJYejZc0BsEvn935vTJH0Mh0gqrA1twjUw", "travel"],
  ["2015 - 100 Songs for Tacos", "https://docs.google.com/document/d/11u9lLM8RFYT2h9AWpIpUTsRHjmrR2I371A64FWwM4Uw", "travel"],
  ["2012 - Mardi Gras", "https://docs.google.com/document/d/1Damwxpao4ls2IUwjX5VzPlXluEa73hSLqfgx8VEih8k", "travel"],
  ["2015 - Elisha's Birthday", "https://docs.google.com/document/d/1ZZey301JFEfRm2L4CgHNhPWlwPH8wfe9HcSt5ILGNlA", "travel"],
  ["2013 - Winter Thaws", "https://docs.google.com/document/d/1vzqa1GWxzA-9MtICEdXahBzFFzCelJ05z37lHkGtN2U", "travel"],
  ["2015 - Reynolds", "https://docs.google.com/document/d/1SKmNx7Ky3zEhR6TQbO_NOWH6xEax2nGE1qSVaYRMVec", "travel"],
  ["2014 - Labor Day", "https://docs.google.com/document/d/1bO9dYiSaqt-h5-Nq7BUV0kshxp2b3arsRXoyMD-WSgM", "travel"],
  ["2014 - New Orleans, Mardi Gras", "https://docs.google.com/document/d/1EUrNFIAQAsIJnR5oM2wIUWzTY53TxoZG2HzE6smHs5I", "travel"],
  ["2012 - Columbus", "https://docs.google.com/document/d/1ZMBrF5ALVtSMKQ9DSN_RfwJKw7Yv7oxeVBvkxdXV4Es", "travel"],
  ["Toothpaste", "https://docs.google.com/document/d/1hpE8DRrm0LYRmirLnib6_8wYZgjXpv82kfyHW5wSY1o", "travel", 2015]
];

const PLACES = {
  "Africa": { name: "Africa", lat: -1.2921, lon: 36.8219 },
  "Boston": { name: "Boston", lat: 42.3601, lon: -71.0589 },
  "Chicago": { name: "Chicago", lat: 41.8781, lon: -87.6298 },
  "Collinsville": { name: "Collinsville", lat: 38.6703, lon: -89.9845 },
  "Columbus": { name: "Columbus", lat: 39.9612, lon: -82.9988 },
  "Cuba": { name: "Cuba", lat: 21.5218, lon: -77.7812 },
  "Florida Keys": { name: "Florida Keys", lat: 24.5551, lon: -81.7800 },
  "France": { name: "France", lat: 48.8566, lon: 2.3522 },
  "Galapagos": { name: "Galapagos", lat: -0.9538, lon: -90.9656 },
  "Georgia": { name: "Georgia", lat: 33.7490, lon: -84.3880 },
  "Germany": { name: "Germany", lat: 52.5200, lon: 13.4050 },
  "Greece": { name: "Greece", lat: 37.9838, lon: 23.7275 },
  "Indiana": { name: "Indiana", lat: 39.7684, lon: -86.1581 },
  "Ireland": { name: "Ireland", lat: 53.3498, lon: -6.2603 },
  "Istanbul": { name: "Istanbul", lat: 41.0082, lon: 28.9784 },
  "Knox": { name: "Knox", lat: 40.9478, lon: -90.3712 },
  "Las Vegas": { name: "Las Vegas", lat: 36.1699, lon: -115.1398 },
  "Memphis": { name: "Memphis", lat: 35.1495, lon: -90.0490 },
  "Nashville": { name: "Nashville", lat: 36.1627, lon: -86.7816 },
  "New Orleans": { name: "New Orleans", lat: 29.9511, lon: -90.0715 },
  "Peoria": { name: "Peoria", lat: 40.6936, lon: -89.5890 },
  "Roatan": { name: "Roatan", lat: 16.3244, lon: -86.5366 },
  "Scotland": { name: "Scotland", lat: 55.9533, lon: -3.1883 },
  "Seattle": { name: "Seattle", lat: 47.6062, lon: -122.3321 },
  "St. Louis": { name: "St. Louis", lat: 38.6270, lon: -90.1994 },
  "Texas": { name: "Texas", lat: 30.2672, lon: -97.7431 },
  "Turks and Caicos": { name: "Turks and Caicos", lat: 21.6940, lon: -71.7979 },
  "Wyoming": { name: "Wyoming", lat: 43.0760, lon: -107.2903 }
};

function yearFromTitle(title, fallback) {
  const match = title.match(/\b(19|20)\d{2}\b/);
  return match ? Number(match[0]) : fallback;
}

function subjectFromTitle(title) {
  return title
    .replace(/^\d{4}(?:\s*\/\s*\d{1,2})?(?:\s*\/\s*\d{1,2})?\s*-?\s*/, "")
    .trim() || "Travel notes";
}

function placeFor(title) {
  const subject = subjectFromTitle(title);
  if (/DEF CON|DaveCon/i.test(title)) return "Las Vegas";
  if (/PhreakNIC/i.test(title)) return "Nashville";
  if (/Archon/i.test(title)) return "Collinsville";
  if (/StrangeLoop|STL|Soulard|Schlafly|Trailhead|Lemmons|Maifest|Spamalot|Urban Chestnut|Brewers|Electriquarium|Harry's|BB's|Blarney|MST3K|T3:|Cicada|Oneliners|COVID|Toothpaste|Garden|Reynolds|Labor Day|Memorial Day|Presidents Day|Columbus Day|St. Patrick|Mother's Day|Thanksgiving|Eclipse|Fourth|Winter Thaws|100 Songs|Elisha|Walla|Penny Arcade|BB King|Tempel/i.test(title)) return "St. Louis";
  if (/Mardi Gras|New Orleans/i.test(title)) return "New Orleans";
  if (/Florida Keys/i.test(title)) return "Florida Keys";
  if (/Turks/i.test(title)) return "Turks and Caicos";
  if (/Roatan/i.test(title)) return "Roatan";
  if (/Ireland/i.test(title)) return "Ireland";
  if (/Boston/i.test(title)) return "Boston";
  if (/Istanbul/i.test(title)) return "Istanbul";
  if (/Texas/i.test(title)) return "Texas";
  if (/Galapagos/i.test(title)) return "Galapagos";
  if (/Germany/i.test(title)) return "Germany";
  if (/Greece/i.test(title)) return "Greece";
  if (/Scotland/i.test(title)) return "Scotland";
  if (/Memphis/i.test(title)) return "Memphis";
  if (/France/i.test(title)) return "France";
  if (/Africa/i.test(title)) return "Africa";
  if (/Cuba/i.test(title)) return "Cuba";
  if (/Wyoming/i.test(title)) return "Wyoming";
  if (/Seattle/i.test(title)) return "Seattle";
  if (/Georgia/i.test(title)) return "Georgia";
  if (/Indiana/i.test(title)) return "Indiana";
  if (/Columbus/i.test(title)) return "Columbus";
  if (/Peoria/i.test(title)) return "Peoria";
  if (/Knox/i.test(title)) return "Knox";
  return subject;
}

function tagsFor(title, source) {
  const tags = [];
  if (/DEF CON|PhreakNIC|Archon|StrangeLoop|STL JUG/i.test(title)) tags.push("conference");
  if (/wedding|Mother|Thanksgiving|Family|Folks|Heirlooms|Graduation/i.test(title)) tags.push("family");
  if (/Florida Keys|Turks|Roatan|Galapagos|Cuba|Africa/i.test(title)) tags.push("islands");
  if (/Ireland|Germany|Greece|Scotland|France|Istanbul/i.test(title)) tags.push("international");
  if (/Mardi Gras|Festival|Maifest|Labor Day|Memorial Day|Presidents Day|Columbus Day|St. Patrick|Eclipse/i.test(title)) tags.push("event");
  return [...new Set(tags)];
}

function stopsFor(place) {
  return PLACES[place] ? [PLACES[place]] : [];
}

window.TRAVELOGUES = DOCS.map(([title, url, source, fallbackYear]) => {
  const year = yearFromTitle(title, fallbackYear);
  const place = placeFor(title);
  return {
    title,
    year,
    place,
    tags: tagsFor(title, source),
    summary: `${subjectFromTitle(title)} notes from the public Google Docs archive.`,
    url,
    stops: stopsFor(place)
  };
});
