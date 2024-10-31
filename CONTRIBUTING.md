# CONTRIBUTING

***Bu sayfa henüz tamamlanmamıştır ve geliştirilmeye devam etmektedir.***

## Projenin Amacı ve Vizyonu

Bu proje, kişisel programlarım ve tüm içeriklerim için hazırlamış olduğumuz bir [monorepo](https://docs.npmjs.com/cli/v8/using-npm/workspaces). Amacımız bu sektördeki yeni başlamış kişilerin kendini nasıl bu sektörde hızlıca ileri götürebileceğini kendimiz üzerinden kanıtlayabilmek. Bu sebeple de projemiz açık kaynak kodlu olacaktır. Katkıda bulunarak, bu vizyonu gerçekleştirmemize yardımcı olabilirsiniz.

## Katkıda Bulunma Süreci

Bu projeye katkıda bulunmak için, aşağıdaki adımları takip edebilirsiniz:

1. Bu projeyi fork edin.
2. Yeni bir branch oluşturun: `git checkout -b yeni-özellik`
3. Değişikliklerinizi commit edin: `git commit -am 'Yeni özellik eklendi'`
4. Branch'inizi push edin: `git push origin yeni-özellik`
5. Pull request oluşturun.
6. Değerlendirme sonrasında pull request'iniz onaylanabilir.
7. Değişikliklerinizin projeye dahil edilmesiyle ilgili bir e-posta alabilirsiniz.

## Davranış Kuralları

Katkıda bulunurken lütfen [Davranış Kurallarımıza](CODE_OF_CONDUCT.md) uyun. Saygılı ve yapıcı bir ortam oluşturmak için hepimizin sorumluluğu vardır.

## Geliştirme Ortamının Kurulumu

1. Repoyu klonlayın: `git clone https://github.com/yigityalim/mehmetyigityalim.git`
2. Bağımlılıkları yükleyin: `pnpm install` veya `yarn install`
3. Geliştirme sunucusunu başlatın: `pnpm run dev` veya `yarn dev`

## Kod Standartları ve Stil Kılavuzu

- TypeScript kullanıyoruz. Lütfen tüm yeni kod için tip tanımlamalarını ekleyin.
- Biome kullanıyoruz. Monorepo Linter için de [sherif](https://github.com/QuiiBz/sherif). Lütfen commit etmeden önce `pnpm run lint:ws` ve `pnpm run lint:ws:fix` komutlarını çalıştırın.
- Komponet isimlendirmelerinde PascalCase, fonksiyon ve değişken isimlerinde camelCase kullanın.

## Commit Mesajları ve Branch Adlandırma

- Commit mesajları için [Conventional Commits](https://www.conventionalcommits.org/) standardını kullanıyoruz.
- Branch isimleri için `feature/`, `bugfix/`, `docs/` gibi ön ekler kullanın. Bu sayede hangi türde bir değişiklik yaptığınızı hızlıca anlayabiliriz.

## Test Yazma ve Çalıştırma

- Yeni özellikler için birim testleri yazın.
- Şu anda projede testler bulunmamaktadır. Testlerinizi `*.test.ts` uzantılı dosyalarda yazabilirsiniz.
- Testleri çalıştırmak için: `pnpm run test` veya `yarn test`

## Katkıda Bulunabileceğiniz Alanlar

Bu projeye katkıda bulunabileceğiniz alanlar aşağıdaki gibidir:

```markdown
├── apps
│   ├── app
│   │   └── *
│   ├── api
│   │   ├── app
│   │   │   ├── /
│   │   │   └── v1
│   │   │       └── now-playing
│   │   └── lib
│   │       ├── spotify.ts
│   │       ├── types.ts
│   │       └── utils.ts
│   ├── status
│   │   └── *
│   └── website
│       └── *
├── packages
│   ├── db
│   │   └── *
│   └── ui
│       ├── .storybook
│       ├── components
│       ├── hooks
│       ├── cn.ts
│       ├── font.ts
│       ├── globals.css
│       ├── index.ts
│       └── theme.tsx
└── tooling
    └── typescript
        ├── base.json
        ├── nextjs.json
        ├── package.json
        └── react-library.json
```

| Yol                                     | Açıklama                                                  |
| --------------------------------------- | --------------------------------------------------------- |
| `apps/app/*`                            | Ana uygulama dosyaları ve dizinleri                       |
| `apps/api/app/`                         | API ana dizini                                            |
| `apps/api/app/v1/now-playing`           | API'nin v1 sürümü için "now-playing" endpoint'i           |
| `apps/api/lib/spotify.ts`               | Spotify ile ilgili yardımcı fonksiyonlar                  |
| `apps/api/lib/types.ts`                 | API için tip tanımlamaları                                |
| `apps/api/lib/utils.ts`                 | Genel yardımcı fonksiyonlar                               |
| `apps/status/*`                         | Durum uygulaması dosyaları ve dizinleri                   |
| `apps/website/*`                        | Web sitesi uygulaması dosyaları ve dizinleri              |
| `packages/db/*`                         | Veritabanı paketi dosyaları ve dizinleri                  |
| `packages/ui/.storybook`                | UI bileşenleri için Storybook yapılandırması              |
| `packages/ui/components`                | Paylaşılan UI bileşenleri                                 |
| `packages/ui/hooks`                     | Paylaşılan React hooks                                    |
| `packages/ui/cn.ts`                     | Muhtemelen sınıf adları (class names) için yardımcı dosya |
| `packages/ui/font.ts`                   | Font yapılandırması veya yardımcı fonksiyonları           |
| `packages/ui/globals.css`               | Global CSS stilleri                                       |
| `packages/ui/index.ts`                  | UI paketinin ana giriş noktası                            |
| `packages/ui/theme.tsx`                 | Tema yapılandırması veya bileşeni                         |
| `tooling/typescript/base.json`          | Temel TypeScript yapılandırması                           |
| `tooling/typescript/nextjs.json`        | Next.js projeleri için TypeScript yapılandırması          |
| `tooling/typescript/package.json`       | TypeScript araçları için paket yapılandırması             |
| `tooling/typescript/react-library.json` | React kütüphaneleri için TypeScript yapılandırması        |
| `*`                                     | CONTRIBUTING sayfasına eklenmemiş kısımlar                |

## Dokümantasyon

- Yeni özellikler veya değişiklikler için ilgili dokümantasyonu güncelleyin.
- Yeni bir bileşen eklediğinizde, Storybook'ta gösterilmesi için gerekli adımları takip edin. Eğer Storybook bilgisi yoksa, öğrenmek için [Storybook Dökümantasyonu](https://storybook.js.org/docs/react/get-started/introduction)na göz atın. *Bu bir opsiyondur*, ancak yeni bileşenlerin Storybook'ta gösterilmesi, diğer geliştiricilerin kullanımını kolaylaştırır.
- README.md dosyasını güncel tutun.

## Issue ve Pull Request Süreçleri

- Yeni bir issue açmadan önce, benzer bir issue'nun var olup olmadığını kontrol edin.
- Pull request'ler en az bir onay almalıdır.
- Büyük değişiklikler için önce bir issue açıp tartışmaya açın.

## Sık Sorulan Sorular (SSS)

Bu bölüm henüz oluşturulmamıştır.

## İletişim Kanalları

- Discord: Mevcut değil
- GitHub Discussions: Mevcut değil

## Lisans Bilgisi

Bu proje GNU AFFERO GENERAL PUBLIC LICENSE altında lisanslanmıştır. Katkıda bulunarak, katkınızın bu lisans altında yayınlanmasını kabul etmiş olursunuz. Daha fazla bilgi için [LICENSE](LICENSE) dosyasına bakabilirsiniz.

---

Katkılarınız için şimdiden teşekkür ederiz! Sayenizde bu proje ile gelişim sağlayacaklar dışında, biz de kendimizi sizin sayenizde her zaman geliştireceğiz. Herhangi bir sorunuz veya öneriniz varsa, lütfen bir issue açmaktan çekinmeyin. 🚀

Mevcut sürüm: 0.1.0

Son güncelleme: 31.10.2024:19.45

Son güncelleyen: @yigityalim
