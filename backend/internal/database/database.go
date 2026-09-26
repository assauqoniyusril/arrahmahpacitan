package database

import (
	"fmt"
	"log"
	"time"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"

	"reportase-foto/backend/internal/config"
	"reportase-foto/backend/internal/models"
)

func Connect(cfg config.Config) (*gorm.DB, error) {
	logLevel := logger.Warn
	if cfg.Environment == "development" {
		logLevel = logger.Info
	}

	var db *gorm.DB
	var err error
	for attempt := 1; attempt <= 10; attempt++ {
		db, err = gorm.Open(postgres.Open(cfg.DSN()), &gorm.Config{Logger: logger.Default.LogMode(logLevel)})
		if err == nil {
			break
		}
		log.Printf("database connection attempt %d failed: %v", attempt, err)
		time.Sleep(2 * time.Second)
	}
	if err != nil {
		return nil, fmt.Errorf("connect database: %w", err)
	}

	if err := db.AutoMigrate(&models.User{}, &models.News{}); err != nil {
		return nil, fmt.Errorf("migrate database: %w", err)
	}
	if err := seedAdmin(db, cfg); err != nil {
		return nil, err
	}
	if cfg.Environment == "development" {
		if err := seedNews(db); err != nil {
			return nil, err
		}
	}
	return db, nil
}

func seedAdmin(db *gorm.DB, cfg config.Config) error {
	hash, err := bcrypt.GenerateFromPassword([]byte(cfg.AdminPassword), bcrypt.DefaultCost)
	if err != nil {
		return fmt.Errorf("hash admin password: %w", err)
	}

	var existing models.User
	err = db.Where("email = ?", cfg.AdminEmail).First(&existing).Error
	if err == nil {
		// User already exists, update credentials/name if needed
		existing.Name = cfg.AdminName
		existing.PasswordHash = string(hash)
		if err := db.Save(&existing).Error; err != nil {
			return fmt.Errorf("update admin user: %w", err)
		}
		log.Printf("updated initial admin user %s", cfg.AdminEmail)
		return nil
	} else if err != gorm.ErrRecordNotFound {
		return fmt.Errorf("check admin user: %w", err)
	}

	admin := models.User{
		Name:         cfg.AdminName,
		Email:        cfg.AdminEmail,
		PasswordHash: string(hash),
	}
	if err := db.Create(&admin).Error; err != nil {
		return fmt.Errorf("seed admin: %w", err)
	}
	log.Printf("seeded initial admin user %s", cfg.AdminEmail)
	return nil
}

func seedNews(db *gorm.DB) error {
	var count int64
	if err := db.Model(&models.News{}).Count(&count).Error; err != nil {
		return fmt.Errorf("check news seed: %w", err)
	}
	if count > 0 {
		return nil
	}

	items := []models.News{
		{Title: "Pagi Semangat, Siswa SDIT Ar Rahmah Mulai Belajar dengan Khidmat", Slug: "pagi-semangat-siswa-sdit-ar-rahmah-mulai-belajar-dengan-khidmat", Summary: "Suasana pagi di SDIT Ar Rahmah Pacitan dipenuhi semangat belajar, ibadah, dan kedisiplinan siswa dalam setiap aktivitasnya.", Content: "Setiap pagi, siswa SDIT Ar Rahmah Pacitan hadir dengan semangat yang tinggi untuk memulai aktivitas belajar. Pembiasaan tilawah, doa bersama, dan persiapan kelas menjadi rutinitas yang menumbuhkan kedisiplinan dan kekhusyukan.\n\nDi lingkungan sekolah, pembelajaran tidak hanya menekankan akademik, tetapi juga membentuk karakter. Guru membimbing siswa agar menjadi pribadi yang cerdas, berakhlak mulia, dan siap menghadapi tantangan masa depan.\n\nKegiatan pagi ini menjadi bukti bahwa pendidikan yang holistik mampu menumbuhkan semangat belajar yang sehat, religius, dan berdaya saing.", FeaturedImage: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1800&q=85", ImageCaption: "Siswa SDIT Ar Rahmah Pacitan memulai aktivitas pagi dengan semangat belajar dan ibadah.", Category: "Kegiatan", Published: true},
		{Title: "Program Literasi Qurani Menyemai Budaya Membaca di Sekolah", Slug: "program-literasi-qurani-menyemai-budaya-membaca-di-sekolah", Summary: "SDIT Ar Rahmah Pacitan mengembangkan literasi Qurani agar siswa tumbuh menjadi pembelajar yang tekun dan berakhlak mulia.", Content: "Dalam rangka menumbuhkan kecintaan terhadap Al-Qur'an dan ilmu pengetahuan, SDIT Ar Rahmah Pacitan terus mengembangkan program literasi Qurani di sekolah. Siswa diajak membaca, menulis, dan memahami makna ayat-ayat yang menjadi pegangan hidup.\n\nKegiatan ini tidak hanya memperkuat pemahaman agama, tetapi juga melatih konsentrasi, kedisiplinan, dan kebiasaan membaca yang positif. Diharapkan, budaya literasi ini akan menjadi karakter kuat yang terbawa sampai kehidupan sehari-hari.\n\nMelalui pendekatan yang menyenangkan dan terarah, sekolah ingin menyiapkan generasi yang cerdas secara intelektual dan kuat secara spiritual.", FeaturedImage: "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1400&q=85", ImageCaption: "Siswa mengikuti kegiatan literasi Qurani dengan fokus dan semangat belajar.", Category: "Pembelajaran", Published: true},
		{Title: "Prestasi Gemilang, Siswa SDIT Ar Rahmah Raih Juara di Ajang Lokal", Slug: "prestasi-gemilang-siswa-sdit-ar-rahmah-raih-juara-di-ajang-lokal", Summary: "Keberhasilan siswa dalam ajang kompetisi lokal menjadi bukti komitmen sekolah dalam membangun karakter dan prestasi yang unggul.", Content: "SDIT Ar Rahmah Pacitan kembali menorehkan prestasi di berbagai ajang kompetisi yang digelar di tingkat lokal. Siswa-siswa berprestasi menunjukkan kemampuan terbaik mereka dalam bidang akademik, kreativitas, dan sikap sportif.\n\nKeberhasilan ini tidak lepas dari kerja keras, latihan rutin, dan didikan guru yang konsisten dalam membimbing siswa. Prestasi bukan hanya hasil dari kemampuan individu, tetapi juga kolaborasi keluarga dan sekolah.\n\nDengan semangat ini, SDIT Ar Rahmah Pacitan terus mendorong siswa untuk berkembang menjadi anak yang unggul, mandiri, dan siap menyumbangkan kebaikan bagi lingkungan sekitar.", FeaturedImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=85", ImageCaption: "Siswa meraih prestasi dengan semangat kompetisi yang sehat dan penuh sportivitas.", Category: "Prestasi", Published: true},
		{Title: "Bakti Sosial dan Kemanusiaan, SDIT Ar Rahmah Tumbuhkan Kepedulian Sosial", Slug: "bakti-sosial-dan-kemanusiaan-sdit-ar-rahmah-tumbuhkan-kepedulian-sosial", Summary: "Melalui kegiatan sosial, siswa diajak peduli pada sesama, menjaga empati, dan menebar manfaat di lingkungan sekitar.", Content: "SDIT Ar Rahmah Pacitan mengajak siswa untuk aktif dalam kegiatan bakti sosial dan kepedulian lingkungan. Kegiatan ini menjadi salah satu cara sekolah menanamkan nilai empati, kepekaan, dan kepedulian terhadap sesama.\n\nDalam praktiknya, siswa terlibat dalam berbagi kebutuhan sederhana, membantu sesama, dan menjaga kebersihan lingkungan sekitar sekolah. Hal ini menjadi bentuk nyata dari pendidikan karakter yang tidak berhenti di ruang kelas.\n\nDengan semangat berbagi, siswa belajar bahwa keberhasilan bukan hanya soal prestasi, tetapi juga sejauh mana mereka memberi manfaat untuk orang lain.", FeaturedImage: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1400&q=85", ImageCaption: "Siswa mengikuti kegiatan bakti sosial dengan penuh semangat dan kepedulian.", Category: "Kegiatan", Published: true},
	}
	if err := db.Create(&items).Error; err != nil {
		return fmt.Errorf("seed development news: %w", err)
	}
	return nil
}
