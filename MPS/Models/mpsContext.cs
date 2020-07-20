using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace MPS.Models
{
    public partial class mpsContext : DbContext
    {
        public mpsContext()
        {
        }

        public mpsContext(DbContextOptions<mpsContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Admin> Admin { get; set; }
        public virtual DbSet<Car> Car { get; set; }
        public virtual DbSet<DriverCar> DriverCar { get; set; }
        public virtual DbSet<Driver> Driver { get; set; }
        public virtual DbSet<InboundOrder> InboundOrder { get; set; }
        public virtual DbSet<OutboundOrder> OutboundOrder { get; set; }
        public virtual DbSet<Schemaversions> Schemaversions { get; set; }
        public virtual DbSet<Store> Store { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseMySQL("Name=MpsDbConnection");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Admin>(entity =>
            {
                entity.HasKey(e => e.Login_id)
                    .HasName("PRIMARY");

                entity.ToTable("admins");

                entity.Property(e => e.Login_id)
                    .HasColumnName("login_id")
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.Password)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Car>(entity =>
            {
                entity.HasKey(e => e.Registration)
                    .HasName("PRIMARY");

                entity.ToTable("cars");

                entity.Property(e => e.Registration)
                    .HasMaxLength(15)
                    .IsUnicode(false);

                entity.Property(e => e.Colour)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.Make)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.Model)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<DriverCar>(entity =>
            {
                entity.HasKey(e => new { e.Driver_id, e.Registration })
                    .HasName("PRIMARY");

                entity.ToTable("driver_car");

                entity.HasIndex(e => e.Registration)
                    .HasName("registration");

                entity.Property(e => e.Driver_id)
                    .HasColumnName("driver_id")
                    .HasColumnType("int(6)");

                entity.Property(e => e.Registration)
                    .HasMaxLength(15)
                    .IsUnicode(false);

                entity.HasOne(d => d.Driver)
                    .WithMany(p => p.DriverCar)
                    .HasForeignKey(d => d.Driver_id)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("driver_car_ibfk_1");

                entity.HasOne(d => d.RegistrationNavigation)
                    .WithMany(p => p.DriverCar)
                    .HasForeignKey(d => d.Registration)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("driver_car_ibfk_2");
            });

            modelBuilder.Entity<Driver>(entity =>
            {
                entity.HasKey(e => e.Driver_id)
                    .HasName("PRIMARY");

                entity.ToTable("drivers");

                entity.Property(e => e.Driver_id)
                    .HasColumnName("DriverID")
                    .HasColumnType("int(6)");

                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(25)
                    .IsUnicode(false);

                entity.Property(e => e.Tel_no)
                    .IsRequired()
                    .HasMaxLength(20)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<InboundOrder>(entity =>
            {
                entity.HasKey(e => new { e.Batch_id, e.Pallet_id })
                    .HasName("PRIMARY");

                entity.ToTable("inbound_order");

                entity.HasIndex(e => new { e.Status, e.Wms_request_status_read })
                    .HasName("ind_status_request_status_read");

                entity.HasIndex(e => new { e.Status, e.Wms_storage_status_read })
                    .HasName("ind_status_storage_status_read");

                entity.Property(e => e.Batch_id)
                    .HasColumnName("batch_id")
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Pallet_id)
                    .HasColumnName("pallet_id")
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Expected_activation_time)
                    .HasColumnName("expected_activation_time")
                    .HasDefaultValueSql("'NULL'");

                entity.Property(e => e.Max_pallet_height)
                    .HasColumnName("max_pallet_height")
                    .HasColumnType("int(11)");

                entity.Property(e => e.Order_pallet_count)
                    .HasColumnName("order_pallet_count")
                    .HasColumnType("int(11)");

                entity.Property(e => e.Pallet_width)
                    .HasColumnName("pallet_width")
                    .HasColumnType("int(11)");

                entity.Property(e => e.Sku_code)
                    .IsRequired()
                    .HasColumnName("sku_code")
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Sku_name)
                    .IsRequired()
                    .HasColumnName("sku_name")
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Status)
                    .IsRequired()
                    .HasColumnName("status")
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Wms_receipt_link_id)
                    .HasColumnName("wms_receipt_link_id")
                    .HasColumnType("int(11)")
                    .HasDefaultValueSql("'NULL'");

                entity.Property(e => e.Wms_request_status_read)
                    .HasColumnName("wms_request_status_read")
                    .HasColumnType("int(11)")
                    .HasDefaultValueSql("'NULL'");

                entity.Property(e => e.Wms_storage_status_read)
                    .HasColumnName("wms_storage_status_read")
                    .HasColumnType("int(11)")
                    .HasDefaultValueSql("'NULL'");
            });

            modelBuilder.Entity<OutboundOrder>(entity =>
            {
                entity.HasKey(e => new { e.Batch_id, e.Pallet_id })
                    .HasName("PRIMARY");

                entity.ToTable("outbound_order");

                entity.Property(e => e.Batch_id)
                    .HasColumnName("batch_id")
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Pallet_id)
                    .HasColumnName("pallet_id")
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Automated_activation_time)
                    .HasColumnName("automated_activation_time")
                    .HasDefaultValueSql("'NULL'");

                entity.Property(e => e.Expected_activation_time)
                    .HasColumnName("expected_activation_time")
                    .HasDefaultValueSql("'NULL'");

                entity.Property(e => e.Index)
                    .HasColumnName("index")
                    .HasColumnType("int(11)");

                entity.Property(e => e.Order_pallet_count)
                    .HasColumnName("order_pallet_count")
                    .HasColumnType("int(11)");

                entity.Property(e => e.Source)
                    .HasColumnName("source")
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasDefaultValueSql("'NULL'");

                entity.Property(e => e.Status)
                    .IsRequired()
                    .HasColumnName("status")
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Target)
                    .HasColumnName("target")
                    .HasColumnType("bigint(20)")
                    .HasDefaultValueSql("'NULL'");

                entity.Property(e => e.Wms_link_id)
                    .HasColumnName("wms_link_id")
                    .HasColumnType("int(11)")
                    .HasDefaultValueSql("'NULL'");

                entity.Property(e => e.Wms_output_status_read)
                    .HasColumnName("wms_output_status_read")
                    .HasColumnType("int(11)")
                    .HasDefaultValueSql("'NULL'");

                entity.Property(e => e.Wms_request_status_read)
                    .HasColumnName("wms_request_status_read")
                    .HasColumnType("int(11)")
                    .HasDefaultValueSql("'NULL'");
            });

            modelBuilder.Entity<Schemaversions>(entity =>
            {
                entity.HasKey(e => e.Schemaversionid)
                    .HasName("PRIMARY");

                entity.ToTable("schemaversions");

                entity.Property(e => e.Schemaversionid)
                    .HasColumnName("schemaversionid")
                    .HasColumnType("int(11)");

                entity.Property(e => e.Applied)
                    .HasColumnName("applied")
                    .HasDefaultValueSql("'current_timestamp()'")
                    .ValueGeneratedOnAddOrUpdate();

                entity.Property(e => e.Scriptname)
                    .IsRequired()
                    .HasColumnName("scriptname")
                    .HasMaxLength(255)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Store>(entity =>
            {
                entity.HasKey(e => e.Pallet_id)
                    .HasName("PRIMARY");

                entity.ToTable("store");

                entity.HasIndex(e => e.Car_reg)
                    .HasName("car_reg");

                entity.Property(e => e.Pallet_id)
                    .HasColumnName("pallet_iD")
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Car_reg)
                    .HasColumnName("car_reg")
                    .HasMaxLength(15)
                    .IsUnicode(false)
                    .HasDefaultValueSql("'NULL'");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
