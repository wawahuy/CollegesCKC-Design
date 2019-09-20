using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace cshape_tim_link_fb
{
    public partial class Waiting : Form
    {
        Timer timer;

        public Waiting()
        {
            InitializeComponent();

            timer = new Timer();
            timer.Interval = 250;
            timer.Tick += new EventHandler(OnDotTick);
            timer.Start();
        }

        private void OnDotTick(object sender, EventArgs e)
        {
            int leng = m_lbdot.Text.Length;
            switch (leng)
            {
                case 0:
                case 1:
                case 2:
                    m_lbdot.Text += ".";
                    break;

                case 3:
                    m_lbdot.Text = "";
                    break;
            }
        }

        private void Waiting_FormClosed(object sender, FormClosedEventArgs e)
        {
            timer.Stop();
        }
    }
}
