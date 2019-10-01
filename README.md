supportxmr-gui is a lightweight, low resource pool UI for <a href="https://github.com/Snipa22/nodejs-pool" target="_blank">nodejs-pool</a> (<a href="https://github.com/Snipa22/" target="_blank">by Snipa22</a>). It is javascript based and is self contained within 4 files + favicon. When minified, total disk size is 68KB with no external dependencies.

Page Load Performance Specs (Single Worker):
<table>
<tr>
  <td width="20%" align="center">supportxmr-gui</td>
  <td></td>
  <td width="20%" align="center">Old Frontend</td>
</tr>
<tr>
  <td width="20%" align="center">4 KB</td>
  <td align="center">HTML</td>
  <td width="20%" align="center">10 KB</td>
</tr>
<tr>
  <td align="center">3 / 68 KB</td>
  <td align="center">Static Files</td>
  <td align="center">48 / 6,031 KB</td>
</tr>
<tr>
  <td align="center">8</td>
  <td align="center">Data Lookups</td>
  <td align="center">14</td>
</tr>
<tr>
  <td align="center">113 KB</td>
  <td align="center">Resources Total</td>
  <td align="center">6,031 KB</td>
</tr>
<tr>
  <td align="center">1.5 Sec</td>
  <td align="center">Page Load (w/o CDN)</td>
  <td align="center">6 Sec</td>
</tr>
 <tr>
  <td align="center">--</td>
  <td align="center">Page Load (w/ CDN)</td>
  <td align="center">--</td>
</tr>
</table>

<b>Compatibility</b>
supportxmr-gui requires ECMAScript 5 (Chrome 23, Firefox 21, IE 10, Safari 6, Opera 15). In theory IE9 could work, but Microsoft browsers have already taken up too much of my life.

Tor in high-security mode blocks svg elements and this UI is entirely svg-based. Tor's other security modes work fine.

<b>Hosting</b>
supportxmr-gui just needs the web server of your choice to serve favicon.ico and index.html which is a good candidate for Gzip compression.

The static files are best served on CDN and can have a long cache. This speeds up load times, increases your concurrency and will have some downages go unnoticed.









