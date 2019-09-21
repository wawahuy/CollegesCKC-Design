namespace cshape_tim_link_fb
{
    partial class Waiting
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
            this.lb_notifi = new System.Windows.Forms.Label();
            this.m_lbdot = new System.Windows.Forms.Label();
            this.SuspendLayout();
            // 
            // lb_notifi
            // 
            this.lb_notifi.Location = new System.Drawing.Point(40, 28);
            this.lb_notifi.Name = "lb_notifi";
            this.lb_notifi.Size = new System.Drawing.Size(181, 13);
            this.lb_notifi.TabIndex = 0;
            this.lb_notifi.Text = "Đang đợi phản hồi từ server";
            this.lb_notifi.TextAlign = System.Drawing.ContentAlignment.MiddleRight;
            // 
            // m_lbdot
            // 
            this.m_lbdot.AutoSize = true;
            this.m_lbdot.Location = new System.Drawing.Point(217, 28);
            this.m_lbdot.Name = "m_lbdot";
            this.m_lbdot.Size = new System.Drawing.Size(16, 13);
            this.m_lbdot.TabIndex = 1;
            this.m_lbdot.Text = "...";
            // 
            // Waiting
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(332, 70);
            this.Controls.Add(this.m_lbdot);
            this.Controls.Add(this.lb_notifi);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.SizableToolWindow;
            this.Name = "Waiting";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = " ";
            this.TopMost = true;
            this.FormClosed += new System.Windows.Forms.FormClosedEventHandler(this.Waiting_FormClosed);
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        public System.Windows.Forms.Label lb_notifi;
        private System.Windows.Forms.Label m_lbdot;
    }
}