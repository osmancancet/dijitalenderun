#!/bin/bash
# Dijital Enderun - Kapsamlı Site Testi
# Kullanım: bash scripts/test-site.sh

BASE="https://dijitalenderun.org"
PASS=0
FAIL=0
WARN=0

green() { echo -e "\033[32m✓ $1\033[0m"; ((PASS++)); }
red() { echo -e "\033[31m✗ $1\033[0m"; ((FAIL++)); }
yellow() { echo -e "\033[33m⚠ $1\033[0m"; ((WARN++)); }

test_url() {
  local url="$1"
  local desc="$2"
  local status=$(curl -s -o /dev/null -w "%{http_code}" "$url" --max-time 10)
  if [ "$status" = "200" ]; then
    green "$desc ($url) - $status"
  else
    red "$desc ($url) - $status"
  fi
}

test_api_data() {
  local url="$1"
  local desc="$2"
  local key="$3"
  local response=$(curl -s "$url" --max-time 10)
  local status=$(echo "$response" | head -c 1)

  if echo "$response" | grep -q "\"error\""; then
    red "$desc - API hatası döndü"
    return
  fi

  if [ -n "$key" ]; then
    local count=$(echo "$response" | python3 -c "import sys,json; d=json.load(sys.stdin); items=d.get('$key',[]); print(len(items) if isinstance(items,list) else 0)" 2>/dev/null)
    if [ "$count" -gt 0 ] 2>/dev/null; then
      green "$desc - $count kayıt"
    elif [ "$count" = "0" ]; then
      yellow "$desc - 0 kayıt (boş)"
    else
      red "$desc - Veri okunamadı"
    fi
  else
    green "$desc - OK"
  fi
}

echo ""
echo "======================================"
echo "  DİJİTAL ENDERUN - SİTE TEST RAPORU"
echo "  $(date '+%Y-%m-%d %H:%M:%S')"
echo "======================================"
echo ""

# 1. SAYFA ERİŞİM TESTLERİ
echo "📄 SAYFA ERİŞİM TESTLERİ"
echo "---"
test_url "$BASE" "Ana Sayfa"
test_url "$BASE/tr/sbky-ders-notlari" "SBKY Ders Notları"
test_url "$BASE/tr/mevzuat-ders-notlari" "Mevzuat Ders Notları"
test_url "$BASE/tr/sbky-sozluk" "SBKY Sözlük"
test_url "$BASE/tr/biyografiler" "Biyografiler"
test_url "$BASE/tr/dr-ozan-yetkin" "Dr. Ozan Yetkin"
test_url "$BASE/tr/hakkimizda" "Hakkımızda"
test_url "$BASE/tr/iletisim" "İletişim"
test_url "$BASE/tr/resmi-gazete" "Resmi Gazete"
test_url "$BASE/tr/personel-ilanlari" "Personel İlanları"
test_url "$BASE/tr/gizlilik-politikasi" "Gizlilik Politikası"
echo ""

# 2. API TESTLERİ
echo "🔌 API TESTLERİ"
echo "---"
test_api_data "$BASE/api/public/homepage" "Homepage API" "slider"
test_api_data "$BASE/api/public/ders-notlari?type=sbky" "SBKY Ders Notları API" "notes"
test_api_data "$BASE/api/public/ders-notlari?type=mevzuat" "Mevzuat Ders Notları API" "notes"
test_api_data "$BASE/api/public/sozluk" "Sözlük API" "items"
test_api_data "$BASE/api/public/biyografiler" "Biyografiler API" "items"
test_api_data "$BASE/api/public/resmi-gazete" "Resmi Gazete API" "items"
test_api_data "$BASE/api/public/personel-ilanlari" "Personel İlanları API" "items"
test_api_data "$BASE/api/public/reklamlar" "Reklamlar API" "items"
test_api_data "$BASE/api/public/profile" "Profil API" ""
test_api_data "$BASE/api/public/hakkimizda" "Hakkımızda API" ""
echo ""

# 3. SEO TESTLERİ
echo "🔍 SEO TESTLERİ"
echo "---"
test_url "$BASE/sitemap.xml" "Sitemap"
test_url "$BASE/robots.txt" "Robots.txt"
test_url "$BASE/google5642890e46960400.html" "Google Verification"

# Google Analytics check
ga_check=$(curl -s "$BASE" --max-time 10 | grep -c "gtag\|G-EW8H5DV72J")
if [ "$ga_check" -gt 0 ]; then
  green "Google Analytics script yüklü"
else
  red "Google Analytics script bulunamadı"
fi
echo ""

# 4. GÜVENLİK TESTLERİ
echo "🔒 GÜVENLİK TESTLERİ"
echo "---"

# Admin API auth kontrolü
admin_status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/api/admin/slider" --max-time 10)
if [ "$admin_status" = "401" ]; then
  green "Admin API auth korumalı (401 dönüyor)"
else
  red "Admin API korumasız! ($admin_status dönüyor)"
fi

# Debug endpoint kaldırılmış mı
debug_status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/api/public/debug" --max-time 10)
if [ "$debug_status" = "404" ]; then
  green "Debug endpoint kaldırılmış (404)"
else
  red "Debug endpoint hâlâ erişilebilir! ($debug_status)"
fi

# Upload auth kontrolü
upload_status=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE/api/admin/upload" --max-time 10)
if [ "$upload_status" = "401" ]; then
  green "Upload API auth korumalı (401)"
else
  yellow "Upload API durumu: $upload_status"
fi
echo ""

# 5. 404 SAYFASI TESTİ
echo "📛 404 TESTİ"
echo "---"
notfound_status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/bu-sayfa-yok-12345" --max-time 10)
if [ "$notfound_status" = "404" ]; then
  green "404 sayfası çalışıyor"
else
  yellow "404 sayfası durumu: $notfound_status"
fi
echo ""

# 6. ÇOK DİLLİ TEST
echo "🌐 ÇOK DİLLİ TEST"
echo "---"
test_url "$BASE/en/sbky-ders-notlari" "İngilizce sayfa"
test_url "$BASE/de/sbky-ders-notlari" "Almanca sayfa"
test_url "$BASE/ar/sbky-ders-notlari" "Arapça sayfa"
echo ""

# 7. PERFORMANS TESTİ
echo "⚡ PERFORMANS TESTİ"
echo "---"
load_time=$(curl -s -o /dev/null -w "%{time_total}" "$BASE" --max-time 15)
if (( $(echo "$load_time < 3.0" | bc -l) )); then
  green "Ana sayfa yükleme: ${load_time}s (< 3s)"
elif (( $(echo "$load_time < 5.0" | bc -l) )); then
  yellow "Ana sayfa yükleme: ${load_time}s (yavaş)"
else
  red "Ana sayfa yükleme: ${load_time}s (çok yavaş)"
fi

api_time=$(curl -s -o /dev/null -w "%{time_total}" "$BASE/api/public/homepage" --max-time 15)
if (( $(echo "$api_time < 1.0" | bc -l) )); then
  green "Homepage API yanıt: ${api_time}s (< 1s)"
elif (( $(echo "$api_time < 2.0" | bc -l) )); then
  yellow "Homepage API yanıt: ${api_time}s (yavaş)"
else
  red "Homepage API yanıt: ${api_time}s (çok yavaş)"
fi
echo ""

# ÖZET
echo "======================================"
echo "  TEST SONUÇLARI"
echo "======================================"
echo -e "  \033[32m✓ Başarılı: $PASS\033[0m"
echo -e "  \033[33m⚠ Uyarı:    $WARN\033[0m"
echo -e "  \033[31m✗ Başarısız: $FAIL\033[0m"
echo "  Toplam:    $((PASS + WARN + FAIL))"
echo "======================================"
