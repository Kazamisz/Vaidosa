export interface CompanyData {
  nome: string;
  segmento: string;
  descricao_do_instagram: string;
  endereco: string;
  endereco_observacao: string;
  cidade: string;
  estado: string;
  telefone: string;
  whatsapp_number: string;
  whatsapp_url: string;
  site: string;
  instagram: string;
  google_maps: string;
  horarios: {
    dias: string;
    horario: string;
    domingo: string;
  };
}

export const COMPANY: CompanyData = {
  nome: "Vaidosa Plus Size Ele&Ela",
  segmento: "Loja de Roupa",
  descricao_do_instagram: "MODA PLUS SIZE . ATÉ 70 FEMININA | ATÉ 80 MASCULINO | Somos especialistas em modinha",
  endereco: "Av. Cidade Jardim, 1100 - Cidade Jardim, Birigui - SP, 16203-124, Brasil",
  endereco_observacao: "O perfil do Instagram cita número 1109 e o Google Maps indica número 1100. Recomendamos confirmar com a loja antes do deslocamento.",
  cidade: "Birigui",
  estado: "São Paulo",
  telefone: "+55 18 99649-2221",
  whatsapp_number: "5518996492221",
  whatsapp_url: "https://wa.me/5518996492221",
  site: "https://instagram.com/vaidosaplussize_eleela?utm_medium=copy_link",
  instagram: "https://www.instagram.com/vaidosa_plussize_eleeela",
  google_maps: "https://www.google.com/maps/search/?api=1&query=Vaidosa%20Plus%20Size%20Ele%26Ela&query_place_id=ChIJJ8OG3p8VlpQR_HuZuDlHPi8",
  horarios: {
    dias: "Segunda a Sábado: 08:00 às 18:00",
    horario: "08:00 - 18:00",
    domingo: "Domingo: Fechado"
  }
};
