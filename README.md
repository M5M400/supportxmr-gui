supportxmr-gui is a lightweight, low resource pool UI for <a href="https://github.com/Snipa22/nodejs-pool" target="_blank">nodejs-pool</a> (<a href="https://github.com/Snipa22/" target="_blank">by Snipa22</a>). It is javascript based and is self contained within 4 files + favicon. When minified, total disk size is 76KB with no external dependencies.

Page Load Performance Specs (Single Worker):
<table>
<tr>
  <td width="20%" align="center">supportxmr-gui</td>
  <td></td>
  <td width="20%" align="center">Old Frontend</td>
</tr>
<tr>
  <td width="20%" align="center">2.5 KB</td>
  <td align="center">HTML</td>
  <td width="20%" align="center">10 KB</td>
</tr>
<tr>
  <td align="center">3 / 72 KB</td>
  <td align="center">Static Files</td>
  <td align="center">48 / 6,031 KB</td>
</tr>
<tr>
  <td align="center">7</td>
  <td align="center">Data Lookups</td>
  <td align="center">14</td>
</tr>
<tr>
  <td align="center">102 KB</td>
  <td align="center">Resources Total</td>
  <td align="center">6,031 KB</td>
</tr>
<tr>
  <td align="center">.5 Sec</td>
  <td align="center">Page Load (w/o CDN)</td>
  <td align="center">5 Sec</td>
</tr>
</table>

<b>Compatibility</b><br>
supportxmr-gui requires ECMAScript 5 (Chrome 23, Firefox 21, IE 10, Safari 6, Opera 15). In theory IE9 could work, but Microsoft browsers have already taken up too much of my life.

Tor in high-security mode blocks svg elements and this UI is entirely svg-based. Tor's other security modes work fine.

A very optimized font file is used and does not support accents or special characters. See the Language and Localization section to increase compatibility.

<b>Hosting</b><br>
supportxmr-gui just needs the web server of your choice to serve favicon.ico and index.html which is a good candidate for Gzip compression.

The static files are best served on CDN and can have a long cache. This speeds up load times, increases your concurrency and will have some downages go unnoticed.

<b>Language and Localization</b><br>
supportxmr-gui automatically localizes decimals, thousand seperators, percent and time formats based on the users browser settings. Language used in the UI has been organized into a single point of configuration to make translation easier.

There is also an optional font pack provided that extends glyph support to Latin W01 & W02: Albanian (sq), Croatian (hr), Czech (cs), Danish (da), Dutch (nl), English (en), Estonian (et), Finnish (fi), French (fr), German (de), Hungarian (hu), Icelandic (is), Italian (it), Latvian (lv), Lithuanian (lt), Norwegian (nn), Polish (pl), Portuguese (pt), Romanian (ro), Slovak (sk), Slovenian (sl), Spanish (es), Swedish (sv), Turkish (tr), Welsh (cy).

For additional language support you can substitute your own font with the necessary glyphs in the stylesheet. Any condensed sans-serif font will work fine as a substitute and you can optimize the font file for your needs.








