supportxmr-gui is a lightweight, low resource pool UI for <a href="https://github.com/Snipa22/nodejs-pool" target="_blank">nodejs-pool</a> (<a href="https://github.com/Snipa22/" target="_blank">by Snipa22</a>). It is fully self contained within 4 files + jQuery + favicon. When minified, total disk size is 158KB with no external dependencies.

Page Load Performance Specs (Single Worker):
<table>
<tr>
  <td width="20%" align="center">supportxmr-gui</td>
  <td></td>
  <td width="20%" align="center">Old Frontend</td>
</tr>
<tr>
  <td width="20%" align="center">3 KB</td>
  <td align="center">HTML</td>
  <td width="20%" align="center">10 KB</td>
</tr>
<tr>
  <td align="center">3 / 64 KB</td>
  <td align="center">Static Files</td>
  <td align="center">48 / 4,702 KB</td>
</tr>
<tr>
  <td align="center">82 KB</td>
  <td align="center">jQuery</td>
  <td align="center">261 KB</td>
</tr>
<tr>
  <td align="center">8</td>
  <td align="center">Data Lookups</td>
  <td align="center">14</td>
</tr>
<tr>
  <td align="center">239 KB</td>
  <td align="center">Resources Total</td>
  <td align="center">6,041 KB</td>
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








