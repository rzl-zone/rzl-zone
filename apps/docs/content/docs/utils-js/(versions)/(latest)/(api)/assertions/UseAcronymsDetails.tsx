/* eslint-disable quotes */
import { Accordion, Accordions } from "@/components/mdx/accordion";

export const UseAcronymsDetails = () => {
  return (
    <Accordions
      type="single"
      className="mt-2 mb-0"
    >
      <Accordion
        title={"More Details"}
        scrollToId
        value="acronyms-details"
        id="acronyms-details"
      >
        <strong>
          When enabled (<code>true</code>), common technical acronyms (e.g.,
          <code>&quot;URL&quot;</code>, <code>&quot;HTTP&quot;</code>,{" "}
          <code>&quot;HTML&quot;</code>, <code>&quot;SVG&quot;</code>,{" "}
          <code>&quot;SVG&quot;</code>, <code>&quot;DOM&quot;</code>) are
          preserved in their original uppercase form instead of being lowercased
          or altered by case-formatting utilities.
        </strong>
        <ul>
          <li>
            When <code>false</code> (default):
            <ul>
              <li>
                Acronyms are treated as normal words and formatted according to
                the selected
                <code>formatCase</code>.
              </li>

              <li>
                Example:
                <ul>
                  <li>
                    <code>HTMLDivElement</code> ➔{" "}
                    <code>&quot;html-div-element&quot;</code> (with
                    <code>&quot;toKebabCase&quot;</code>).
                  </li>

                  <li>
                    <code>DOMParser</code> ➔ <code>&quot;dom-parser&quot;</code>{" "}
                    (with
                    <code>&quot;toKebabCase&quot;</code>).
                  </li>
                </ul>
              </li>
            </ul>
          </li>

          <li>
            When <code>true</code>:
            <ul>
              <li>
                Acronyms are treated as normal words and formatted according to
                the selected
                <code>formatCase</code>.
              </li>

              <li>
                Example:
                <ul>
                  <li>
                    <code>HTMLDivElement</code> ➔{" "}
                    <code>&quot;HTML-div-element&quot;</code> (with
                    <code>&quot;toKebabCase&quot;</code>).
                  </li>

                  <li>
                    <code>DOMParser</code> ➔ <code>&quot;DOM-parser&quot;</code>{" "}
                    (with
                    <code>&quot;toKebabCase&quot;</code>).
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </Accordion>
      <Accordion
        title={"The list of recognized acronyms"}
        scrollToId
        value="acronyms-list"
        id="acronyms-list"
        className=""
      >
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            URI
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            URL
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            URN
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            HTTP
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            HTTPS
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            FTP
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            FTPS
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            SFTP
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            SSH
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            SMTP
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            POP3
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            IMAP
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            WS
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            WSS
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            TCP
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            UDP
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            IP
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            ICMP
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            ARP
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            RTP
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            RTSP
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            SIP
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            HTML
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            XHTML
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            XML
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            WBR
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            CSS
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            SVG
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            JSON
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            JSONP
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            DOM
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            IDB
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            DB
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            RTC
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            ICE
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            TLS
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            SSL
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            CORS
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            WASM
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            CSR
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            SSR
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            PWA
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            DPI
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            CDN
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            JS
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            TS
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            JSX
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            TSX
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            CLI
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            API
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            SDK
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            UI
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            UX
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            OS
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            ID
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            UUID
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            PID
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            NPM
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            YARN
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            ESM
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            CJS
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            BOM
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            MVC
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            MVVM
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            ORM
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            DAO
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            CRUD
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            FIFO
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            LIFO
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            OOP
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            FP
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            REPL
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            CSV
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            TSV
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            SQL
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            YAML
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            JSON
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            MD
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            INI
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            PDF
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            XLS
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            XLSX
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            RTF
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            XML
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            BMP
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            GIF
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            PNG
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            JPEG
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            WEBP
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            MP3
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            MP4
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            AVI
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            MOV
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            FLAC
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            MKV
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            WAV
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            URLSearchParams
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            XHR
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            2D
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            3D
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            GL
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            WebGL
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            TTL
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            UID
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            GID
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            MAC
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            IP
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            DNS
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            DHCP
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            VPN
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            LAN
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            WAN
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            SSID
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            IoT
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            API
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            SDK
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            CLI
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            LTS
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            EOL
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            CPU
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            GPU
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            RAM
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            ROM
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            SSD
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            HDD
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            BIOS
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            USB
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            PCI
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            SATA
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            DIMM
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            DDR
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            VGA
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            HDMI
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            KVM
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            ASIC
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            FPGA
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            SoC
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            NAS
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            SAN
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            TCP
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            UDP
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            IP
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            MAC
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            DNS
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            DHCP
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            VPN
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            LAN
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            WAN
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            SSID
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            NAT
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            QoS
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            MPLS
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            BGP
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            OSPF
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            ICMP
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            IGMP
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            LLDP
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            ARP
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            RARP
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            AES
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            RSA
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            OTP
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            MFA
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            PKI
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            VPN
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            IAM
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            ACL
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            CSP
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            XSS
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            CSRF
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            HSTS
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            WAF
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            DDoS
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            IDS
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            IPS
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            SOC
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            SIEM
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            AWS
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            GCP
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            AZURE
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            CI
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            CD
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            K8S
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            IaC
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            PaaS
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            SaaS
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            IaaS
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            API
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            CLI
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            SDK
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            REST
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            SOAP
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            JSON-RPC
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            gRPC
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            ELB
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            EKS
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            AKS
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            FaaS
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            CaaS
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            GUI
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            IDE
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            FAQ
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            UX
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            UI
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            CLI
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            API
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            SDK
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            LTS
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            EOL
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            WYSIWYG
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            CMS
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            CRM
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            GPS
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            LED
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            OLED
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            LCD
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            RFID
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            NFC
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            CPU
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            GPU
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            AI
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            ML
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            DL
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            DB
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            SQL
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            NoSQL
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            ORM
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            JSON
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            XML
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            CSV
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            HTTP
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            HTTPS
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            TDD
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            BDD
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            CI
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            CD
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            QA
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            SLA
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            SLO
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            MTTR
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            MTBF
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            UAT
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            RPA
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            KPI
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            OKR
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            ROI
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            RFP
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            SLA
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            CRM
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            ERP
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            PMO
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            SCRUM
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            KANBAN
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            FPS
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            HDR
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            VR
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            AR
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            3D
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            2D
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            MP3
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            MP4
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            GIF
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            PNG
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            JPEG
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            SVG
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            BMP
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            TIFF
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            POSIX
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            NTFS
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            FAT
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            EXT
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            EXT4
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            APFS
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            HFS
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            ISO
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            HTML
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            CSS
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            JS
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            TS
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            PHP
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            SQL
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            JSON
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            XML
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            YAML
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            BASH
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            ZSH
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            JSON
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            YAML
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            INI
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            DOTENV
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            VM
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            VMM
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            VPC
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            OCI
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            LXC
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            Docker
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            K8S
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            CRI
          </span>
        </div>
        <div>
          -{" "}
          <span
            className={`text-fd-success before:content-['"'] after:content-['"']`}
          >
            CNI
          </span>
        </div>
      </Accordion>
    </Accordions>
  );
};
