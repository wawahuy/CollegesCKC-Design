namespace cshape_tim_link_fb
{
    partial class BrowserProfileBox
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.panel1 = new System.Windows.Forms.Panel();
            this.panelWindowChrome = new System.Windows.Forms.Panel();
            this.groupBox1 = new System.Windows.Forms.GroupBox();
            this.panel1.SuspendLayout();
            this.SuspendLayout();
            // 
            // panel1
            // 
            this.panel1.Controls.Add(this.groupBox1);
            this.panel1.Dock = System.Windows.Forms.DockStyle.Top;
            this.panel1.Location = new System.Drawing.Point(0, 0);
            this.panel1.Name = "panel1";
            this.panel1.Size = new System.Drawing.Size(859, 136);
            this.panel1.TabIndex = 0;
            // 
            // panelWindowChrome
            // 
            this.panelWindowChrome.Dock = System.Windows.Forms.DockStyle.Fill;
            this.panelWindowChrome.Location = new System.Drawing.Point(0, 136);
            this.panelWindowChrome.Name = "panelWindowChrome";
            this.panelWindowChrome.Size = new System.Drawing.Size(859, 435);
            this.panelWindowChrome.TabIndex = 1;
            this.panelWindowChrome.LocationChanged += new System.EventHandler(this.panelWindowChrome_SizeChanged);
            this.panelWindowChrome.SizeChanged += new System.EventHandler(this.panelWindowChrome_SizeChanged);
            this.panelWindowChrome.Move += new System.EventHandler(this.panelWindowChrome_SizeChanged);
            this.panelWindowChrome.Resize += new System.EventHandler(this.panelWindowChrome_SizeChanged);
            // 
            // groupBox1
            // 
            this.groupBox1.Dock = System.Windows.Forms.DockStyle.Fill;
            this.groupBox1.Location = new System.Drawing.Point(0, 0);
            this.groupBox1.Name = "groupBox1";
            this.groupBox1.Size = new System.Drawing.Size(859, 136);
            this.groupBox1.TabIndex = 0;
            this.groupBox1.TabStop = false;
            // 
            // BrowserProfileBox
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(859, 571);
            this.Controls.Add(this.panelWindowChrome);
            this.Controls.Add(this.panel1);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.SizableToolWindow;
            this.Location = new System.Drawing.Point(302, 0);
            this.Name = "BrowserProfileBox";
            this.StartPosition = System.Windows.Forms.FormStartPosition.Manual;
            this.Text = "Trình duyệt";
            this.FormClosed += new System.Windows.Forms.FormClosedEventHandler(this.BrowserProfileBox_FormClosed);
            this.Load += new System.EventHandler(this.BrowserProfileBox_Load);
            this.panel1.ResumeLayout(false);
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.Panel panel1;
        private System.Windows.Forms.Panel panelWindowChrome;
        private System.Windows.Forms.GroupBox groupBox1;
    }
}