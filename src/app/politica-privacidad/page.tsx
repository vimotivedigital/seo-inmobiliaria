import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { buildEditorialMetadata } from "@/lib/seo";
import { PARTNER_AGENCY_NAME, PARTNER_AGENCY_CONTACT } from "@/lib/partner-agency";

export const metadata: Metadata = buildEditorialMetadata(
  "Politica de privacidad",
  "Que datos personales recoge TipoFijo en el formulario de vender vivienda, con que finalidad, a quien se ceden y como ejercer tus derechos RGPD.",
  "/politica-privacidad"
);

export default function PoliticaPrivacidadPage() {
  return (
    <article className="prose dark:prose-invert max-w-none">
      <Breadcrumbs items={[{ name: "Inicio", href: "/" }, { name: "Politica de privacidad", href: "/politica-privacidad" }]} />

      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Politica de privacidad</h1>

      <p className="text-sm text-slate-500 dark:text-slate-400">
        Esta pagina aplica especificamente a los datos personales que recogemos en el formulario
        de la seccion <a href="/vender-vivienda">Vender vivienda</a>. El resto del sitio (calculadoras,
        guias, blog) no recoge datos personales.
      </p>

      <h2>Responsable del tratamiento</h2>
      <p>
        TipoFijo es el responsable del tratamiento de los datos que introduces en el formulario de
        vender vivienda. Para cualquier consulta sobre privacidad, escribe a{" "}
        <a href="mailto:privacidad@tipofijo.com">privacidad@tipofijo.com</a>.
      </p>

      <h2>Que datos recogemos</h2>
      <p>Cuando rellenas el formulario de vender vivienda, recogemos:</p>
      <ul>
        <li>Nombre</li>
        <li>Email</li>
        <li>Telefono</li>
        <li>Localidad de la vivienda que quieres vender</li>
        <li>Mensaje adicional, si decides escribirlo (opcional)</li>
        <li>Metadatos tecnicos del envio (fecha y hora, direccion IP) usados unicamente para evitar
          spam y para poder acreditar cuando y con que consentimiento se envio cada solicitud.</li>
      </ul>

      <h2>Con que finalidad tratamos tus datos</h2>
      <p>Tratamos estos datos para dos finalidades distintas, cada una con su propio consentimiento explicito en el formulario:</p>
      <ol>
        <li>
          <strong>Que TipoFijo te contacte</strong> en relacion con tu solicitud de valoracion,
          si hace falta aclarar o completar algun dato.
        </li>
        <li>
          <strong>Que tus datos se cedan a {PARTNER_AGENCY_NAME}</strong>, la agencia inmobiliaria
          colaboradora que gestiona las valoraciones y ventas en tu zona, para que pueda
          contactarte directamente con una valoracion de tu vivienda. Esta cesion solo se produce
          si marcas expresamente esa casilla; es independiente de la anterior y nunca se asume por
          defecto.
        </li>
      </ol>
      <p>
        Dato de contacto publico de la agencia colaboradora, para que sepas quien recibe tus
        datos si aceptas la cesion: {PARTNER_AGENCY_CONTACT}.
      </p>

      <h2>Base legal</h2>
      <p>
        La base legal para ambos tratamientos es tu consentimiento explicito (art. 6.1.a RGPD),
        prestado de forma libre, especifica, informada e inequivoca al marcar cada casilla del
        formulario. Puedes retirar tu consentimiento en cualquier momento (ver &ldquo;Tus
        derechos&rdquo; mas abajo) sin que ello afecte a la licitud del tratamiento previo a la
        retirada.
      </p>

      <h2>Plazo de conservacion</h2>
      <p>
        Conservamos tus datos mientras dure la gestion de tu solicitud de valoracion/venta y,
        agotada esta, durante el plazo adicional necesario para acreditar el cumplimiento de
        nuestras obligaciones legales (incluida la prueba del consentimiento prestado), con un
        maximo de 24 meses desde el ultimo contacto, salvo que ejerzas tu derecho de supresion
        antes de ese plazo.
      </p>

      <h2>Tus derechos (acceso, rectificacion, supresion y demas derechos RGPD)</h2>
      <p>Puedes ejercer en cualquier momento y de forma gratuita tus derechos de:</p>
      <ul>
        <li><strong>Acceso:</strong> saber que datos tuyos tratamos.</li>
        <li><strong>Rectificacion:</strong> corregir datos inexactos.</li>
        <li><strong>Supresion:</strong> pedir que eliminemos tus datos.</li>
        <li><strong>Oposicion y limitacion:</strong> oponerte al tratamiento o pedir que lo limitemos.</li>
        <li><strong>Portabilidad:</strong> recibir tus datos en un formato estructurado.</li>
        <li><strong>Retirar el consentimiento</strong> en cualquier momento, sin que afecte a la licitud del tratamiento anterior.</li>
      </ul>
      <p>
        Para ejercerlos, escribe a <a href="mailto:privacidad@tipofijo.com">privacidad@tipofijo.com</a>{" "}
        indicando el derecho que quieres ejercer y adjuntando un documento que acredite tu
        identidad. Si tu solicitud afecta a datos ya cedidos a {PARTNER_AGENCY_NAME}, la
        trasladaremos a la agencia para que la resuelva tambien por su parte, sin perjuicio de tu
        derecho a dirigirte directamente a ella con el contacto indicado arriba.
      </p>
      <p>
        Tambien puedes presentar una reclamacion ante la Agencia Espanola de Proteccion de Datos
        (<a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer nofollow">www.aepd.es</a>)
        si consideras que no hemos atendido correctamente tu solicitud.
      </p>

      <h2>Con quien mas compartimos tus datos</h2>
      <p>
        Ademas de la agencia colaboradora (solo si aceptas esa casilla especifica), usamos Resend
        como proveedor tecnico para el envio del email de aviso de cada solicitud; Resend actua
        como encargado del tratamiento y no usa tus datos con fines propios. No cedemos tus datos
        a ningun otro tercero.
      </p>
    </article>
  );
}
